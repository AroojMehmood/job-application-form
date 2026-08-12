import { useState } from "react";
import axios from "axios";
import FileUploadBox from "./FileUploadBox";

const API_BASE_URL = "http://localhost:5000";

function JobApplicationForm() {
  // Har field ka data ek hi object mein store kar rahe hain
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    experience: "",
  });

  // File alag se store hoga (text data ke saath nahi)
  const [resumeFile, setResumeFile] = useState(null);
  // Har field ka error message store karne ke liye
  const [errors, setErrors] = useState({});
  // Submit ho rahi hai ya nahi (loading)
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Real upload progress (0-100) — axios se aata hai, fake nahi
  const [uploadProgress, setUploadProgress] = useState(0);
  // Success ke baad uploaded file ka info (preview dikhane ke liye)
  const [uploadedFile, setUploadedFile] = useState(null);

  // Success/error message dikhane ke liye
  const [submitStatus, setSubmitStatus] = useState(null); // { type: "success"/"error", message: "..." }

  // Jab bhi koi text/dropdown/date field change ho
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Jab FileUploadBox se naya file mile (ya remove ho, to null milega)
  const handleFileSelect = (file) => {
    setResumeFile(file);
    setErrors((prev) => ({ ...prev, resume: undefined }));
    setUploadedFile(null); // naya file select hote hi purana uploaded preview hata do
  };

  // Sab fields ko check karta hai, errors object return karta hai
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone number must be at least 10 digits";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Please select your date of birth";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select your gender";
    }

    if (!formData.experience) {
      newErrors.experience = "Please select your experience level";
    }

    if (!resumeFile) {
      newErrors.resume = "Please upload a PDF or image file";
    } else {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(resumeFile.type)) {
        newErrors.resume = "Only PDF, JPG, and PNG files are allowed";
      } else if (resumeFile.size > 5 * 1024 * 1024) {
        newErrors.resume = "File size must be less than 5MB";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // yahin ruk jao, backend ko request mat bhejo
    }

    setErrors({});
    setSubmitStatus(null);
    setIsSubmitting(true);
    setUploadProgress(0);

    // Text data + file ko ek FormData object mein pack kar rahe hain
    const dataToSend = new FormData();
    dataToSend.append("fullName", formData.fullName);
    dataToSend.append("email", formData.email);
    dataToSend.append("phone", formData.phone);
    dataToSend.append("dateOfBirth", formData.dateOfBirth);
    dataToSend.append("gender", formData.gender);
    dataToSend.append("experience", formData.experience);
    dataToSend.append("resume", resumeFile);

    // Submit se pehle file ka type/name save kar lete hain (reset hone se pehle)
    const submittedFileIsImage = resumeFile.type.startsWith("image/");
    const submittedFileName = resumeFile.name;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/applications`,
        dataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          // Ye asli upload progress track karta hai — koi fake timer nahi
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          },
        }
      );

      setSubmitStatus({
        type: "success",
        message: response.data.message || "Application submitted successfully!",
      });

      // Backend se aayi filename se uploaded file ka URL banate hain
      const savedFilename = response.data.data.resume;
      setUploadedFile({
        url: `${API_BASE_URL}/uploads/${savedFilename}`,
        isImage: submittedFileIsImage,
        name: submittedFileName,
      });

      // Form reset kar dete hain success ke baad
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        experience: "",
      });
      setResumeFile(null);
    } catch (error) {
      // Agar backend ne validation error bheja ho, to woh field-wise errors dikhao
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
        setSubmitStatus({
          type: "error",
          message: "Please fix the errors below.",
        });
      } else {
        setSubmitStatus({
          type: "error",
          message: "Something went wrong. Please try again later.",
        });
      }
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="form-container">
      <h1>Job Application Form</h1>
      <p>Please fill out the form below to apply for this position.</p>

      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
          {errors.fullName && <span className="error-message">{errors.fullName}</span>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. 03001234567"
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>

        {/* Date of Birth */}
        <div className="form-group">
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
          {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
        </div>

        {/* Gender */}
        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">-- Select Gender --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <span className="error-message">{errors.gender}</span>}
        </div>

        {/* Experience */}
        <div className="form-group">
          <label htmlFor="experience">Experience Level</label>
          <select
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
          >
            <option value="">-- Select Experience --</option>
            <option value="Fresher">Fresher</option>
            <option value="0-1 years">0-1 years</option>
            <option value="1-3 years">1-3 years</option>
            <option value="3-5 years">3-5 years</option>
            <option value="5+ years">5+ years</option>
          </select>
          {errors.experience && <span className="error-message">{errors.experience}</span>}
        </div>

        {/* Resume Upload — ab naya FileUploadBox use ho raha hai */}
        <div className="form-group">
          <label>Upload Resume (PDF, JPG, or PNG)</label>
          <FileUploadBox
            file={resumeFile}
            onFileSelect={handleFileSelect}
            error={errors.resume}
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </button>

        {/* Real upload progress bar — sirf submit ke time dikhega */}
        {isSubmitting && (
          <div className="upload-progress-wrap">
            <div
              className="upload-progress-fill"
              style={{ width: `${uploadProgress}%` }}
            />
            <span className="upload-progress-label">{uploadProgress}%</span>
          </div>
        )}

        {submitStatus && (
          <div className={`status-banner ${submitStatus.type}`}>
            {submitStatus.message}
          </div>
        )}

        {/* Success ke baad uploaded file dikhana */}
        {uploadedFile && (
          <div className="uploaded-result">
            <p className="uploaded-result-label">✅ Uploaded file:</p>
            {uploadedFile.isImage ? (
              <img
                src={uploadedFile.url}
                alt={uploadedFile.name}
                className="uploaded-result-img"
              />
            ) : (
              
                <a href={uploadedFile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="uploaded-result-doc"
              >
                📄 {uploadedFile.name} (Open / Download)
              </a>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

export default JobApplicationForm;