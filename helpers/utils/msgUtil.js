const msgUtil = {
  emailValidation: "email is invalid",
  passwordValidation: "password must be 6 characters long",
  firstNameValidation: "first name cannot be empty",
  lastNameValidation: "last name cannot be empty",
  userAlreadyExists: "User with this email already exists",
  userNotFound: "No user with this email exists",
  noUserExists: "No user found",
  userRegisterSuccessfully: "User Registered Successfully.",
  loginSuccess: "User Logged in Successfully",
  invalidEmailOrPassword: "Invalid Email or Password",
  serverErrorMsg: "Internal Server Error. If you see this, contact developer.",
  invalidJwtToken: "Invalid Token",
  databaseConnectionSuccessfull: "Database connection successful",
  databaseConnectionError: "Database connection error",
  postgressUriNotConfigured: "No postgress configured",
  dbInfo: (name) => {
    return `Database name: ${name}`;
  },
  success: "Success",
  cityAlreadyExists: "City name is already exist in database",
  cityAdded: "City Added Successfully",
  cityNameRequired: "City name is required",
  countryNameValidation: "Country name is required",
  eventExists: "There is already a community event with same title in database",
  eventNotFound: "Event not found in database",
  eventAdded: "Event added in database",
  eventsValidations:
    "event title , start date , end date , description , contact no , lat  long and city are required",
  invalidObjectId: "Invalid Object ID",
};

module.exports = msgUtil;
