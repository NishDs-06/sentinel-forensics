interface UploadZoneProps {
  onResult: (data: any) => void
  onFileSelected: (file: File) => void
}

export default function UploadZone({
  onResult,
  onFileSelected,
}: UploadZoneProps) {

  const handleUpload = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch("http://localhost:8001/analyze-upload", {
      method: "POST",
      body: formData,
    })

    if (!res.ok) {
      throw new Error("Upload failed")
    }

    const data = await res.json()
    onResult(data)
  }

  return (
    <div style={{ border: "2px dashed #555", padding: 20 }}>
      <input
        type="file"
        accept="image/*,video/*"
        onChange={async (e) => {
          if (!e.target.files) return
          const file = e.target.files[0]
          onFileSelected(file)
          await handleUpload(file)
        }}
      />
    </div>
  )
}
