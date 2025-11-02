import { Checkbox } from "./ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

export default function Settings() {
  return (
    <div className="bg-background w-screen h-screen p-4 text-neutral-100">
      <h2 className="text-lg font-semibold mb-3">Settings</h2>
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span>Always on top</span>
          <Checkbox />
        </div>
        <div className="flex items-center justify-between">
          <span>Start on login</span>
          <Checkbox />
        </div>
        <div className="flex items-center justify-between">
          <span>Pet</span>
          <ToggleGroup type="multiple">
            <ToggleGroupItem value="hamster">Hamster</ToggleGroupItem>
            <ToggleGroupItem value="cat">Cat</ToggleGroupItem>
            <ToggleGroupItem value="red-panda">Red Panda</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      <p className="mt-4 text-xs text-neutral-400">
        More settings coming soon.
      </p>
    </div>
  );
}
