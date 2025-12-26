interface StatusBadgeProps {
  status?: string;
}

export const getStatusBadge = ({ status }: StatusBadgeProps) => {
  const statusMap: Record<string, { class: string; text: string }> = {
    черновик: { class: "status-draft", text: "Черновик" },
    сформирован: { class: "status-formed", text: "Сформирован" },
    завершен: { class: "status-completed", text: "Завершен" },
    отклонен: { class: "status-rejected", text: "Отклонен" },
  };

  const statusInfo = statusMap[status || ""] || { class: "", text: status || "Неизвестно" };
  return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
};
