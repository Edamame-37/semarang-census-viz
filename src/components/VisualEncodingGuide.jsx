const ENCODING_ROWS = [
  {
    question: 'Empat KPI kota',
    idiom: 'Executive scorecard',
    marks: 'Teks dan angka besar',
    magnitude: 'Nilai eksplisit; ukuran tipografi hanya hierarki, bukan data',
    identity: 'Label metrik, satuan, dan konteks benchmark',
  },
  {
    question: 'Pangsa penduduk',
    idiom: 'Horizontal ranked bar dengan tab metrik',
    marks: 'Bar (garis)',
    magnitude: 'Panjang dari nol dan posisi X',
    identity: 'Label kecamatan; hue biru/abu hanya status di atas atau tidak di atas acuan',
  },
  {
    question: 'Pertumbuhan penduduk',
    idiom: 'Horizontal ranked bar dengan tab metrik',
    marks: 'Bar (garis)',
    magnitude: 'Panjang dari nol dan posisi X',
    identity: 'Label kecamatan; hue hanya status relatif terhadap 0,90%/tahun',
  },
  {
    question: 'Kepadatan per kecamatan',
    idiom: 'Ranked horizontal bar',
    marks: 'Bar (garis)',
    magnitude: 'Panjang dari nol dan posisi X',
    identity: 'Hue biru/abu menandai di atas atau tidak di atas 4.534,07 jiwa/km²; label kecamatan',
  },
  {
    question: 'Kepadatan × pertumbuhan',
    idiom: 'Scatterplot empat kuadran',
    marks: 'Titik (point)',
    magnitude: 'Posisi X (kepadatan) dan Y (pertumbuhan), dua kanal kontinu',
    identity: 'Hue A–D menyatakan kelompok; label teks untuk kecamatan penting',
  },
  {
    question: 'Deviasi rasio jenis kelamin',
    idiom: 'Diverging horizontal bar',
    marks: 'Bar (garis)',
    magnitude: 'Posisi bertanda dari nol: arah dan besar deviasi',
    identity: 'Hue C/B menyatakan arah deviasi; label nilai rasio',
  },
  {
    question: 'Detail dan nilai presisi',
    idiom: 'Panel komparasi dan tabel 16 kecamatan',
    marks: 'Teks dan tabel',
    magnitude: 'Kolom dan baris tetap untuk komparasi bersandingan',
    identity: 'Label baris dan badge kelompok A–D',
  },
]

export default function VisualEncodingGuide() {
  return (
    <section className="methodology visual-guide" id="panduan-visual" aria-labelledby="visual-guide-title">
      <div className="section-heading">
        <div><p className="section-index">04 / Panduan visual · Level 3 Munzner</p><h2 id="visual-guide-title">Cara membaca visual</h2></div>
        <p className="scope-note">Palet warna tetap; posisi, panjang, dan label membawa makna utama.</p>
      </div>

      <div className="visual-guide__grid">
        <figure className="zone-wireframe" aria-labelledby="wireframe-caption">
          <div className="zone-wireframe__frame">
            <div className="zone-wireframe__block zone-wireframe__block--top">
              <strong>Zona atas · Top banner</strong>
              <span>Executive scorecards: 4 KPI untuk jawaban instan di bawah 3 detik.</span>
            </div>
            <div className="zone-wireframe__block zone-wireframe__block--middle">
              <strong>Zona tengah · Analisis utama</strong>
              <span>Scatterplot kepadatan × pertumbuhan dan ranked density bar.</span>
            </div>
            <div className="zone-wireframe__block zone-wireframe__block--bottom">
              <strong>Zona bawah/samping · Rincian</strong>
              <span>Comparison bar, diverging bar, panel detail, dan tabel.</span>
            </div>
          </div>
          <figcaption id="wireframe-caption">Wireframe hierarki visual tiga zona. Kontrol pencarian dan filter menjembatani overview dengan detail sesuai mantra Shneiderman.</figcaption>
        </figure>

        <div className="encoding-rules">
          <h3>Rules of thumb</h3>
          <ul>
            <li><strong>No unjustified 3D.</strong> Semua idiom dua dimensi; tidak ada kedalaman, sudut, atau bayangan yang menyandikan nilai.</li>
            <li><strong>Eyes beat memory.</strong> KPI berbagi satu strip, bar berbagi sumbu dan urutan, dan nilai presisi selalu ada di tabel tanpa perlu mengingat tooltip.</li>
            <li><strong>Shneiderman&apos;s mantra.</strong> Overview first (scorecard dan kepadatan kota), zoom &amp; filter (pencarian, kelompok A–D, tab metrik), details on demand (panel detail, tooltip, tabel).</li>
          </ul>
          <h3>Catatan hue</h3>
          <p>Rubrik menyebut hue alert merah/kuning/hijau. Hue tersebut tidak dipakai karena data tidak memiliki ambang bahaya resmi. Di dashboard ini hue adalah kanal identitas—kelompok A–D atau status di atas/tidak di atas acuan—bukan penilaian baik-buruk.</p>
          <h3>Justifikasi deviasi</h3>
          <p>Line chart tidak dipakai karena hanya ada satu periode observasi (2023) dan pertumbuhan sudah berupa satu angka rata-rata 2020–2023, bukan deret waktu. Choropleth tidak dipakai karena tidak ada geometri kecamatan tervalidasi. Zona tengah memakai scatterplot multidimensi dan ranked bar agar magnitudo tetap terbaca dari posisi dan panjang.</p>
        </div>
      </div>

      <p className="table-scroll-hint">Geser tabel ke samping untuk melihat seluruh kolom.</p>
      <div className="encoding-table-wrap" role="region" aria-label="Tabel encoding dapat digulir horizontal" tabIndex="0">
        <table className="encoding-table">
          <caption>Pemetaan KPI ke idiom visual, marks, dan channels.</caption>
          <thead>
            <tr>
              <th scope="col">KPI atau pertanyaan</th>
              <th scope="col">Idiom visual</th>
              <th scope="col">Marks</th>
              <th scope="col">Magnitude channel</th>
              <th scope="col">Identity channel</th>
            </tr>
          </thead>
          <tbody>
            {ENCODING_ROWS.map((row) => (
              <tr key={row.question}>
                <th scope="row">{row.question}</th>
                <td>{row.idiom}</td>
                <td>{row.marks}</td>
                <td>{row.magnitude}</td>
                <td>{row.identity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
