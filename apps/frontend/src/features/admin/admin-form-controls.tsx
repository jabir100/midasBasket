import { Input, ListBox, Select, Switch } from "@heroui/react";
import { Trash2 } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "../../shared/ui/button.js";

export function AdminSearchInput({
  icon,
  onChange,
  placeholder,
  value,
}: Readonly<{
  icon?: ReactNode;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}>): ReactNode {
  return (
    <div className="admin-search-input">
      {icon}
      <input
        className="admin-search-input-field"
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        aria-label={placeholder}
      />
    </div>
  );
}

export function AdminTableSelect({
  isDisabled,
  label,
  onChange,
  options,
  placeholder,
  renderValue,
  value,
}: Readonly<{
  isDisabled?: boolean;
  label: string;
  onChange: (value: string) => void;
  options: { id: string; label: string }[];
  placeholder?: string;
  renderValue?: () => ReactNode;
  value: string;
}>): ReactNode {
  const selectedOption = options.find((option) => option.id === value);

  return (
    <Select
      aria-label={label}
      className="admin-heroui-select"
      {...(isDisabled !== undefined ? { isDisabled } : {})}
      // HeroUI v3 currently forwards React Aria's single-select API, which is typed as deprecated upstream.
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      selectedKey={value || null}
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      onSelectionChange={(key) => {
        onChange(key ? String(key) : "");
      }}
    >
      <Select.Trigger className="admin-select-trigger">
        <Select.Value>
          {renderValue
            ? renderValue()
            : (selectedOption?.label ?? placeholder ?? "Select")}
        </Select.Value>
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover className="admin-select-popover">
        <ListBox className="admin-select-listbox">
          {options.map((option) => (
            <ListBox.Item
              key={option.id}
              id={option.id}
              textValue={option.label}
              onAction={() => {
                onChange(option.id);
              }}
            >
              {option.label}
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}

type RepeaterItem = {
  value?: string;
  label?: string;
  title?: string;
  description?: string;
};

export function AdminField({
  children,
  label,
}: Readonly<{ children: ReactNode; label: string }>): ReactNode {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function AdminSelect({
  label,
  onChange,
  options,
  placeholder,
  value,
}: Readonly<{
  label: string;
  onChange: (value: string) => void;
  options: { id: string; label: string }[];
  placeholder: string;
  value: string;
}>): ReactNode {
  return (
    <div className="admin-field">
      <span>{label}</span>
      <Select
        aria-label={label}
        className="admin-heroui-select"
        // HeroUI v3 currently forwards React Aria's single-select API, which is typed as deprecated upstream.
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        selectedKey={value || null}
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        onSelectionChange={(key) => {
          onChange(key ? String(key) : "");
        }}
      >
        <Select.Trigger className="admin-select-trigger">
          <Select.Value>
            {options.find((option) => option.id === value)?.label ??
              placeholder}
          </Select.Value>
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover className="admin-select-popover">
          <ListBox className="admin-select-listbox">
            {options.map((option) => (
              <ListBox.Item
                key={option.id}
                id={option.id}
                textValue={option.label}
                onAction={() => {
                  onChange(option.id);
                }}
              >
                {option.label}
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
}

export function AdminSwitch({
  children,
  className,
  isSelected,
  onChange,
}: Readonly<{
  children: ReactNode;
  className?: string;
  isSelected: boolean;
  onChange: (isSelected: boolean) => void;
}>): ReactNode {
  return (
    <Switch
      className={["admin-switch", className].filter(Boolean).join(" ")}
      isSelected={isSelected}
      onChange={onChange}
    >
      <Switch.Content className="admin-switch-content">
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        <span>{children}</span>
      </Switch.Content>
    </Switch>
  );
}

export function RepeaterFields({
  firstLabel,
  items,
  onChange,
  secondLabel,
  title,
}: Readonly<{
  firstLabel: string;
  items: RepeaterItem[];
  onChange: (items: never[]) => void;
  secondLabel: string;
  title: string;
}>): ReactNode {
  const isMetrics = firstLabel === "Value";

  return (
    <fieldset className="admin-repeater">
      <div className="admin-repeater-head">
        <legend>{title}</legend>
        <Button
          tone="ghost"
          onClick={() => {
            onChange([
              ...(items as never[]),
              (isMetrics
                ? { value: "", label: "" }
                : { title: "", description: "" }) as never,
            ]);
          }}
        >
          Add row
        </Button>
      </div>
      {items.map((item, index) => (
        <div
          className="admin-repeater-row"
          key={`${title}-${index.toString()}`}
        >
          <Input
            aria-label={`${title} ${firstLabel}`}
            className="admin-heroui-input"
            value={isMetrics ? (item.value ?? "") : (item.title ?? "")}
            onChange={(event) => {
              const nextItems = [...items];
              nextItems[index] = isMetrics
                ? { ...item, value: event.target.value }
                : { ...item, title: event.target.value };
              onChange(nextItems as never[]);
            }}
            placeholder={firstLabel}
          />
          <Input
            aria-label={`${title} ${secondLabel}`}
            className="admin-heroui-input"
            value={isMetrics ? (item.label ?? "") : (item.description ?? "")}
            onChange={(event) => {
              const nextItems = [...items];
              nextItems[index] = isMetrics
                ? { ...item, label: event.target.value }
                : { ...item, description: event.target.value };
              onChange(nextItems as never[]);
            }}
            placeholder={secondLabel}
          />
          <Button
            iconOnly
            tone="ghost"
            title="Remove row"
            onClick={() => {
              onChange(
                items.filter((_, itemIndex) => itemIndex !== index) as never[],
              );
            }}
            startContent={<Trash2 size={16} />}
          >
            Remove row
          </Button>
        </div>
      ))}
    </fieldset>
  );
}
