export default function Settings() {
  return (
    <div className="w-screen h-screen p-4 text-neutral-100">
      <h2 className="text-lg font-semibold mb-3">Settings</h2>
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span>Always on top</span>
          <input type="checkbox" className="accent-neutral-300" />
        </div>
        <div className="flex items-center justify-between">
          <span>Start on login</span>
          <input type="checkbox" className="accent-neutral-300" />
        </div>
      </div>
      <p className="mt-4 text-xs text-neutral-400">
        More settings coming soon.
      </p>
    </div>
  );
}
