const request = require("supertest");
const app = require("../app");

describe("POST /api/applications", () => {
  // Yeh helper valid form data deta hai — har test isay base bana kar customize karega
  const validFields = {
    fullName: "Arooj Mehmood",
    email: "arooj@example.com",
    phone: "03001234567",
    dateOfBirth: "2007-01-01",
    gender: "Female",
    experience: "Fresher",
  };

  // TEST: Valid data + valid file => application successfully save honi chahiye
  it("saves a valid application and returns 201 with the created data", async () => {
    const res = await request(app)
      .post("/api/applications")
      .field("fullName", validFields.fullName)
      .field("email", validFields.email)
      .field("phone", validFields.phone)
      .field("dateOfBirth", validFields.dateOfBirth)
      .field("gender", validFields.gender)
      .field("experience", validFields.experience)
      .attach("resume", Buffer.from("fake pdf content"), {
        filename: "resume.pdf",
        contentType: "application/pdf",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.fullName).toBe(validFields.fullName);
    expect(res.body.data.email).toBe(validFields.email);
  });

  // TEST: fullName missing => validation error, application save NAHI honi chahiye
  it("rejects submission when fullName is missing", async () => {
    const res = await request(app)
      .post("/api/applications")
      .field("email", validFields.email)
      .field("phone", validFields.phone)
      .field("dateOfBirth", validFields.dateOfBirth)
      .field("gender", validFields.gender)
      .field("experience", validFields.experience)
      .attach("resume", Buffer.from("fake pdf content"), {
        filename: "resume.pdf",
        contentType: "application/pdf",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors.fullName).toBeDefined();
  });

  // TEST: Invalid email format => validation error
  it("rejects submission when email format is invalid", async () => {
    const res = await request(app)
      .post("/api/applications")
      .field("fullName", validFields.fullName)
      .field("email", "not-an-email")
      .field("phone", validFields.phone)
      .field("dateOfBirth", validFields.dateOfBirth)
      .field("gender", validFields.gender)
      .field("experience", validFields.experience)
      .attach("resume", Buffer.from("fake pdf content"), {
        filename: "resume.pdf",
        contentType: "application/pdf",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors.email).toBeDefined();
  });

  // TEST: Invalid experience value (jo enum mein nahi hai) => validation error
  it("rejects submission when experience is not a valid option", async () => {
    const res = await request(app)
      .post("/api/applications")
      .field("fullName", validFields.fullName)
      .field("email", validFields.email)
      .field("phone", validFields.phone)
      .field("dateOfBirth", validFields.dateOfBirth)
      .field("gender", validFields.gender)
      .field("experience", "20+ years") // yeh valid enum mein nahi hai
      .attach("resume", Buffer.from("fake pdf content"), {
        filename: "resume.pdf",
        contentType: "application/pdf",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors.experience).toBeDefined();
  });

});