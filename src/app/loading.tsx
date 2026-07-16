export default function Loading() {
  return (
    <div className="fixed inset-0 bg-brand-mist flex items-center justify-center z-50">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 mb-6">
          <span className="font-heading font-extrabold text-3xl text-white">
            <span className="text-brand-red">24</span>
            <span className="text-brand-night">hours.lk</span>
          </span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="w-3 h-3 bg-brand-red rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-brand-red rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-brand-red rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
