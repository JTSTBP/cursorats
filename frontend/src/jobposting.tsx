import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import "./jobpoting.css"; // 👈 Add your CSS file here

const JobPostForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    client: "",
    employmentType: "",
    experienceRange: "",
    salaryRange: "",
    jdFile: null as File | null,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData({ ...formData, jdFile: file });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const jobData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "jdFile" && value instanceof File) {
          jobData.append("jdFile", value);
        } else {
          jobData.append(key, JSON.stringify(value));
        }
      });
      await axios.post("/api/jobs", jobData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Job posted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error posting job");
    }
  };

  return (
    <div className="jobpost-container">
      <h2 className="jobpost-title">Create New Job</h2>
      <form onSubmit={handleSubmit} className="jobpost-form">
        <div className="form-group">
          <label className="form-label">Job Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Client</label>
          <input
            type="text"
            name="client"
            value={formData.client}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Employment Type</label>
          <input
            type="text"
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-row">
          <div className="form-group half">
            <label className="form-label">Experience Range</label>
            <input
              type="text"
              name="experienceRange"
              value={formData.experienceRange}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. 2-4 years"
            />
          </div>
          <div className="form-group half">
            <label className="form-label">Salary Range</label>
            <input
              type="text"
              name="salaryRange"
              value={formData.salaryRange}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. 5-8 LPA"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Upload JD File</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="form-input"
          />
        </div>

        <button type="submit" className="submit-btn">
          Submit Job
        </button>
      </form>
    </div>
  );
};

export default JobPostForm;
