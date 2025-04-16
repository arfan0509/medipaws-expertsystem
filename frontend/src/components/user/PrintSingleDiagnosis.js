import html2pdf from "html2pdf.js";
/* eslint-disable @typescript-eslint/no-explicit-any */
const PrintSingleDiagnosis = (diagnosisData) => {
    // Format number untuk menampilkan belief dengan benar (2 decimal places)
    const formatNumber = (num) => parseFloat(num.toFixed(2)).toString();
    // Buat elemen container
    const container = document.createElement("div");
    container.innerHTML = `
    <html>
          <head>
            <title>Cetak Diagnosis</title>
            <style>
              @page { size: A4; margin: 20mm; }
              html, body { width: 210mm; font-family: 'Arial', sans-serif; margin: 0; padding: 0; color: #333; }
              .container { width: 100%; padding: 20px; box-sizing: border-box; }
              .header { display: flex; align-items: center; justify-content: center; gap: 15px; border-bottom: 1px solid #ddd; margin-bottom: 20px; padding-bottom: 10px; }
              .header img { width: 60px; height: auto; }
              .header h2 { font-size: 22px; color: #4F81C7; margin: 0; }
              .section { margin-bottom: 20px; page-break-inside: avoid; }
              .section-title { font-weight: bold; font-size: 16px; color: #4F81C7; margin-bottom: 8px; }
              .content-box { padding: 15px; border: 1px solid #eee; border-radius: 6px; background-color: #f9f9f9; }
              .gejala-tag { 
                display: inline-block; 
                color: #333; 
                padding: 5px 10px; 
                margin: 3px 3px 0 0; 
                font-size: 13px; 
              }
              .belief-info {
                margin-top: 5px;
                margin-bottom: 10px;
              }
              .progress-bar-container {
                width: 100%;
                height: 10px;
                background-color: #e0e0e0;
                border-radius: 5px;
                margin: 5px 0;
              }
              .progress-bar {
                height: 100%;
                background-color: #4F81C7;
                border-radius: 5px;
              }
              .alt-penyakit {
                margin-bottom: 20px;
                padding: 10px;
                border-bottom: 1px solid #eee;
                page-break-inside: avoid;
              }
              .alt-penyakit:last-child {
                border-bottom: none;
                margin-bottom: 0;
              }
              .footer { text-align: center; font-size: 13px; color: #777; margin-top: 40px; border-top: 1px solid #ddd; padding-top: 10px; }
              
              /* Untuk mencegah pemotongan */
              .break-before { page-break-before: always; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <img src="/assets/struk.png" alt="Struk Logo" />
                <h2>Detail Diagnosis Kucing</h2>
              </div>
  
              <div class="section">
                <div class="section-title">Informasi Kucing</div>
                <div class="content-box">
                  <p><strong>Nama:</strong> ${diagnosisData.nama_kucing}</p>
                  <p><strong>Jenis Kelamin:</strong> ${diagnosisData.jenis_kelamin}</p>
                  <p><strong>Usia:</strong> ${diagnosisData.usia}</p>
                  <p><strong>Warna Bulu:</strong> ${diagnosisData.warna_bulu}</p>
                </div>
              </div>
  
              <div class="section">
                <div class="section-title">Diagnosis Utama</div>
                <div class="content-box">
                  <p>
                    <strong>Penyakit:</strong> ${diagnosisData.hasil_diagnosis.penyakit}
                  </p>
                  
                  ${diagnosisData.hasil_diagnosis.belief
        ? `<div class="belief-info">
                          <p><strong>Persentase kemungkinan:</strong> ${formatNumber(diagnosisData.hasil_diagnosis.belief)}%</p>
                          <div class="progress-bar-container">
                            <div class="progress-bar" style="width: ${diagnosisData.hasil_diagnosis.belief}%;"></div>
                          </div>
                        </div>`
        : ""}
                  
                  <p><strong>Deskripsi:</strong> ${diagnosisData.hasil_diagnosis.deskripsi || "Tidak tersedia"}</p>
                  
                  <p><strong>Gejala Terdeteksi:</strong></p>
                  <div>
                    ${Array.isArray(diagnosisData.hasil_diagnosis.gejala_terdeteksi)
        ? diagnosisData.hasil_diagnosis.gejala_terdeteksi
            .map((gejala) => `<span class="gejala-tag">${gejala}</span>`)
            .join("")
        : "Tidak ada gejala terdeteksi"}
                  </div>
                  <p style="margin-top: 10px;"><strong>Solusi:</strong> ${diagnosisData.hasil_diagnosis.solusi}</p>
                </div>
              </div>
  
              ${diagnosisData.hasil_diagnosis.kemungkinan_penyakit_lain &&
        diagnosisData.hasil_diagnosis.kemungkinan_penyakit_lain.length >
            0
        ? `<div class="section ${diagnosisData.hasil_diagnosis.kemungkinan_penyakit_lain
            .length > 2
            ? "break-before"
            : ""}">
                      <div class="section-title">Kemungkinan Penyakit Lain (${diagnosisData.hasil_diagnosis.kemungkinan_penyakit_lain
            .length})</div>
                      <div class="content-box">
                        ${diagnosisData.hasil_diagnosis.kemungkinan_penyakit_lain
            .map((penyakit) => `
                            <div class="alt-penyakit">
                              <p>
                                <strong>Penyakit:</strong> ${penyakit.penyakit}
                              </p>
                              ${penyakit.belief
            ? `<div class="belief-info">
                                      <p><strong>Persentase kemungkinan:</strong> ${formatNumber(penyakit.belief)}%</p>
                                      <div class="progress-bar-container">
                                        <div class="progress-bar" style="width: ${penyakit.belief}%;"></div>
                                      </div>
                                    </div>`
            : ""}
                              ${penyakit.deskripsi
            ? `<p><strong>Deskripsi:</strong> ${penyakit.deskripsi}</p>`
            : ""}
                              <p><strong>Gejala:</strong> 
                                ${Array.isArray(penyakit.gejalaCocok) &&
            penyakit.gejalaCocok.length > 0
            ? penyakit.gejalaCocok
                .map((gejala) => `<span class="gejala-tag">${gejala}</span>`)
                .join("")
            : "Tidak ada gejala terdeteksi"}
                              </p>
                              <p><strong>Solusi:</strong> ${penyakit.solusi}</p>
                            </div>
                          `)
            .join("")}
                      </div>
                    </div>`
        : ""}
  
              <div class="section">
                <div class="section-title">Tanggal Diagnosis</div>
                <div class="content-box">
                  ${new Date(diagnosisData.tanggal_diagnosis).toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" })} WIB
                </div>
              </div>
  
              <div class="footer">
                <p>Sistem Pakar Kucing - "Analisis Cerdas untuk Sahabat Berbulu Anda"</p>
              </div>
            </div>
  
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = window.close;
              };
            </script>
          </body>
        </html>
  `;
    html2pdf()
        .set({
        margin: [10, 10],
        filename: `diagnosis-${diagnosisData.nama_kucing}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    })
        .from(container)
        .save();
};
export default PrintSingleDiagnosis;
