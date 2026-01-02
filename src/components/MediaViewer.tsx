interface Props {
  file: File | null
}

export default function MediaViewer({ file }: Props) {
  if (!file) return null

  const url = URL.createObjectURL(file)

  if (file.type.startsWith("video")) {
    return <video src={url} controls width={400} />
  }

  return <img src={url} width={300} />
}
