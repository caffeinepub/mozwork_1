import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Include Storage
  include MixinStorage();

  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type WorkerProfile = {
    name : Text;
    phone : Text;
    profession : Text;
    city : Text;
    neighborhood : Text;
    profilePhotoId : Text;
    hourlyRate : Nat;
    skills : [Text];
    trustBadges : [Text];
    isAvailable : Bool;
    rating : Float;
    jobCount : Nat;
    experienceYears : Nat;
  };

  module WorkerProfile {
    public func compare(wp1 : WorkerProfile, wp2 : WorkerProfile) : Order.Order {
      compareByProfession(wp1, wp2);
    };

    public func compareByProfession(wp1 : WorkerProfile, wp2 : WorkerProfile) : Order.Order {
      Text.compare(wp1.profession, wp2.profession);
    };

    public func compareByCity(wp1 : WorkerProfile, wp2 : WorkerProfile) : Order.Order {
      Text.compare(wp1.city, wp2.city);
    };
  };

  type JobListing = {
    title : Text;
    description : Text;
    requiredSkills : [Text];
    location : Text;
    budget : Nat;
    urgency : Bool;
    category : Text;
    profession : Text;
    hourlyRate : ?Nat;
    isVerified : Bool;
  };

  module JobListing {
    public func compare(jl1 : JobListing, jl2 : JobListing) : Order.Order {
      compareByTitle(jl1, jl2);
    };

    public func compareByTitle(jl1 : JobListing, jl2 : JobListing) : Order.Order {
      Text.compare(jl1.title, jl2.title);
    };

    public func compareByLocation(jl1 : JobListing, jl2 : JobListing) : Order.Order {
      Text.compare(jl1.location, jl2.location);
    };
  };

  type ClientProfile = {
    name : Text;
    phone : Text;
    city : Text;
    neighborhood : Text;
    profilePhotoId : Text;
  };

  // User Profile type for authentication system
  public type UserProfile = {
    name : Text;
    userType : { #worker; #client; #company };
    phone : Text;
    city : Text;
    neighborhood : Text;
    profilePhotoId : Text;
    // Worker-specific fields (optional)
    profession : ?Text;
    hourlyRate : ?Nat;
    skills : [Text];
    trustBadges : [Text];
    isAvailable : ?Bool;
    rating : ?Float;
    jobCount : ?Nat;
    experienceYears : ?Nat;
  };

  // Job Completion Record type
  type JobCompletionRecord = {
    client : Principal;
    worker : Principal;
    rating : Float;
  };

  // App State
  let clientMap = Map.empty<Principal, ClientProfile>();
  let workerMap = Map.empty<Principal, WorkerProfile>();
  let jobMap = Map.empty<Principal, JobListing>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var jobCompletionRecords : [JobCompletionRecord] = [];

  // User Profile Management (Required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Worker Management

  public shared ({ caller }) func addWorker(name : Text, phone : Text, profession : Text, city : Text, neighborhood : Text, profilePhotoId : Text, hourlyRate : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can register as workers");
    };
    
    let newWorker = {
      name;
      phone;
      profession;
      city;
      neighborhood;
      profilePhotoId;
      hourlyRate;
      skills = [];
      trustBadges = ["Novo"];
      isAvailable = true;
      rating = 0.0;
      jobCount = 0;
      experienceYears = 0;
    };
    workerMap.add(caller, newWorker);
  };

  public shared ({ caller }) func addWorkerSkill(skill : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can modify worker profiles");
    };
    
    switch (workerMap.get(caller)) {
      case (null) { false };
      case (?worker) {
        let skills = List.empty<Text>();
        for (s in worker.skills.values()) { skills.add(s) };
        skills.add(skill);
        let workerWithNewSkill : WorkerProfile = {
          name = worker.name;
          phone = worker.phone;
          profession = worker.profession;
          city = worker.city;
          neighborhood = worker.neighborhood;
          profilePhotoId = worker.profilePhotoId;
          hourlyRate = worker.hourlyRate;
          skills = skills.toArray();
          trustBadges = worker.trustBadges;
          isAvailable = worker.isAvailable;
          rating = worker.rating;
          jobCount = worker.jobCount;
          experienceYears = worker.experienceYears;
        };
        workerMap.add(caller, workerWithNewSkill);
        true;
      };
    };
  };

  public query ({ caller }) func getWorkerProfile(worker : Principal) : async ?WorkerProfile {
    // Anyone can view worker profiles (public information)
    workerMap.get(worker);
  };

  public query ({ caller }) func getMyWorkerProfile() : async ?WorkerProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their profile");
    };
    workerMap.get(caller);
  };

  public shared ({ caller }) func updateWorkerAvailability(isAvailable : Bool) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update availability");
    };
    
    switch (workerMap.get(caller)) {
      case (null) { false };
      case (?worker) {
        let updatedWorker : WorkerProfile = {
          name = worker.name;
          phone = worker.phone;
          profession = worker.profession;
          city = worker.city;
          neighborhood = worker.neighborhood;
          profilePhotoId = worker.profilePhotoId;
          hourlyRate = worker.hourlyRate;
          skills = worker.skills;
          trustBadges = worker.trustBadges;
          isAvailable = isAvailable;
          rating = worker.rating;
          jobCount = worker.jobCount;
          experienceYears = worker.experienceYears;
        };
        workerMap.add(caller, updatedWorker);
        true;
      };
    };
  };

  // Client Management

  public shared ({ caller }) func addClient(name : Text, phone : Text, city : Text, neighborhood : Text, profilePhotoId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can register as clients");
    };
    
    let newClient = {
      name;
      phone;
      city;
      neighborhood;
      profilePhotoId;
    };
    clientMap.add(caller, newClient);
  };

  public query ({ caller }) func getClientProfile(client : Principal) : async ?ClientProfile {
    // Anyone can view client profiles (public information)
    clientMap.get(client);
  };

  public query ({ caller }) func getMyClientProfile() : async ?ClientProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their profile");
    };
    clientMap.get(caller);
  };

  // Job Listing Management

  public shared ({ caller }) func addJobListing(title : Text, description : Text, requiredSkills : [Text], location : Text, budget : Nat, urgency : Bool, category : Text, profession : Text, hourlyRate : ?Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can post jobs");
    };
    
    let newJob = {
      title;
      description;
      requiredSkills;
      location;
      budget;
      urgency;
      category;
      profession;
      hourlyRate;
      isVerified = false;
    };
    jobMap.add(caller, newJob);
  };

  public query ({ caller }) func getJobListing(jobOwner : Principal) : async ?JobListing {
    // Anyone can view job listings (public information)
    jobMap.get(jobOwner);
  };

  public query ({ caller }) func getMyJobListings() : async [JobListing] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their jobs");
    };
    
    switch (jobMap.get(caller)) {
      case (null) { [] };
      case (?job) { [job] };
    };
  };

  public query ({ caller }) func getAllJobListings() : async [(Principal, JobListing)] {
    // Anyone can view all job listings (public information)
    jobMap.toArray();
  };

  // Job Completion Record Functions
  public shared ({ caller }) func addJobCompletionRecord(worker : Principal, rating : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can rate workers");
    };
    
    // Verify caller is a client
    switch (clientMap.get(caller)) {
      case (null) {
        Runtime.trap("Unauthorized: Only clients can rate workers");
      };
      case (?_) {
        let record = {
          client = caller;
          worker;
          rating;
        };
        let records = List.empty<JobCompletionRecord>();
        for (r in jobCompletionRecords.values()) {
          records.add(r);
        };
        records.add(record);
        jobCompletionRecords := records.toArray();
      };
    };
  };

  public query ({ caller }) func getJobCompletionRecords() : async [JobCompletionRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view job records");
    };
    jobCompletionRecords;
  };

  public query ({ caller }) func getWorkerRatings(worker : Principal) : async [JobCompletionRecord] {
    // Anyone can view worker ratings (public information)
    jobCompletionRecords.filter<JobCompletionRecord>(func(record) {
      record.worker == worker
    });
  };

  // Admin functions
  public shared ({ caller }) func verifyJobListing(jobOwner : Principal) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can verify job listings");
    };
    
    switch (jobMap.get(jobOwner)) {
      case (null) { false };
      case (?job) {
        let verifiedJob = {
          title = job.title;
          description = job.description;
          requiredSkills = job.requiredSkills;
          location = job.location;
          budget = job.budget;
          urgency = job.urgency;
          category = job.category;
          profession = job.profession;
          hourlyRate = job.hourlyRate;
          isVerified = true;
        };
        jobMap.add(jobOwner, verifiedJob);
        true;
      };
    };
  };

  public query ({ caller }) func getAllWorkers() : async [(Principal, WorkerProfile)] {
    // Anyone can view all workers (public directory)
    workerMap.toArray();
  };

  public query ({ caller }) func getAllClients() : async [(Principal, ClientProfile)] {
    // Anyone can view all clients (public directory)
    clientMap.toArray();
  };
};
