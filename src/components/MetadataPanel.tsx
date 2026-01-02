export default function MetadataPanel({ forensic }: any) {
  return (
    <pre style={{ background: "#111", color: "#0f0", padding: 16 }}>
      {JSON.stringify(forensic, null, 2)}
    </pre>
  )
}
