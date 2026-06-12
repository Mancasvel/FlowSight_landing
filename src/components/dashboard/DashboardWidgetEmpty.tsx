type Props = {
  message: string
}

export default function DashboardWidgetEmpty({ message }: Props) {
  return (
    <p className="px-2 py-10 text-center text-[13px] leading-relaxed text-zinc-400">{message}</p>
  )
}
