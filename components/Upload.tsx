"use client";

const Upload = () => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission from changing the URL

    const formData = new FormData(e.target as HTMLFormElement);
    const res = await fetch("/api/parse-resume", {
      method: "POST",
      body: formData,
    });

    // Optionally handle response (e.g., show success or error message)
    const data = await res.json();
    if (data.success) {
      console.log("Role & Skills extracted successfully");
    } else {
      console.error("Error extracting role & skills");
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input type="file" name="file" accept="application/pdf" />
      <button type="submit">Extract Role & Skills</button>
    </form>
  );
};

export default Upload;
