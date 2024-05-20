export default function PowerBIDashboard() {
  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center">
      <iframe
        title="test"
        className="w-full h-full flex items-center justify-center"
        src="https://app.powerbi.com/reportEmbed?reportId=c727c5e1-8b3a-46a8-b6c5-6515dcfabec6&autoAuth=true&ctid=5e158e2a-0596-4a6c-8801-3502aef4563f"
        frameBorder="0"
        allowFullScreen={true}
      ></iframe>
    </div>
  );
}
