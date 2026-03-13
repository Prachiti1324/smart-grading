import { useState } from "react";
import axios from "axios";

function App() {

  const [studentPdf, setStudentPdf] = useState(null);
  const [referencePdf, setReferencePdf] = useState(null);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔁 PUT YOUR NGROK URL
  const API_URL = "https://1e3f-34-172-181-206.ngrok-free.app/evaluate";

  const submitHandler = async () => {

    if (!studentPdf || !referencePdf) {
      alert("Upload both Student PDF and Reference PDF");
      return;
    }

    const formData = new FormData();
    formData.append("student_pdf", studentPdf);
    formData.append("reference_pdf", referencePdf);
    formData.append("max_marks", 5);

    try {
      setLoading(true);
      setResult(null);

      const res = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(res.data);

    } catch (err) {
      console.log(err.response?.data || err);
      alert(JSON.stringify(err.response?.data));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="app">

      <header className="header">
        <h1>AI Answer Sheet Evaluation System</h1>
        <p>Upload Student & Reference PDFs to get automatic marks</p>
      </header>

      <div className="main">

        {/* Upload Card */}
        <div className="card">

          <h2>Upload PDFs</h2>

          <label>Student Answer Sheet (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setStudentPdf(e.target.files[0])}
          />

          <label>Reference Answer Sheet (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setReferencePdf(e.target.files[0])}
          />

          <button onClick={submitHandler}>
            Evaluate
          </button>

        </div>

        {/* Loader */}
        {loading && (
          <div className="card loader-card">
            <div className="spinner"></div>
            <p>Evaluating answer sheet...</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="card result">

            <h2>Evaluation Result</h2>

            <div className="total-score">
              Total Marks: {result.total_marks}
            </div>

            {result.page_wise_marks.map((p) => (
              <div key={p.page} className="page">

                <h3>Page {p.page}</h3>
                <p>Marks: {p.marks} / {p.max_marks}</p>

                <div className="bar">
                  <div
                    className="fill"
                    style={{
                      width: `${(p.marks / p.max_marks) * 100}%`
                    }}
                  ></div>
                </div>

              </div>
            ))}

            {/* Marked PDF Viewer */}
            <a
              href={`${API_URL.replace("/evaluate", "")}/download/${result.final_marked_pdf}`}
              target="_blank"
              rel="noreferrer"
              className="download-btn"
            >
              View / Download Marked Answer Sheet PDF
            </a>

          </div>
        )}

      </div>

    </div>
  );
}

export default App;