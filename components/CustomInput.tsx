"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";

interface FormInputProps {
  id: string;
  type: string;
  name: string;
  required?: boolean;
  label?: string;
  placeholder?: string;
  value?: any;
  multiple?: boolean;
  touched?: boolean;
  errors?: string;
  inputClassName?: string;
  labelClassName?: string;
  helperTextClassName?: string;
  forEdit?: boolean;
  checkboxDefaultValue?: boolean;
  onCheckedChange?: (e: CheckedState) => void;
  onChange?: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  [x: string]: any;
}

const CustomInput = ({
  id,
  type,
  name,
  required,
  label,
  placeholder,
  value,
  multiple,
  touched,
  errors,
  inputClassName,
  labelClassName,
  helperTextClassName,
  forEdit = false,
  onChange,
  onCheckedChange,
  checkboxDefaultValue,
  ...otherProps
}: FormInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const errorText = errors || "";

  const renderError = () =>
    errors ? (
      <p className={cn("text-sm text-red-500 mt-1", helperTextClassName)}>
        {errorText}
      </p>
    ) : null;

  switch (type) {
    case "switch":
      return (
        <div className="flex items-center gap-2">
          <Label htmlFor={id} className={labelClassName}>
            {label || ""}
          </Label>
          {forEdit ? (
            <Switch
              id={id}
              name={name}
              checked={value === 1}
              onCheckedChange={(val) =>
                onChange?.({ target: { name, value: val ? 1 : 0 } } as any)
              }
              {...otherProps}
            />
          ) : value === 1 ? (
            <CheckCircle className="text-green-500" />
          ) : (
            <XCircle className="text-red-500" />
          )}
          {renderError()}
        </div>
      );

    case "password":
      return (
        <div className="w-full space-y-3">
          {label && (
            <Label htmlFor={id} className={labelClassName}>
              {label}
            </Label>
          )}
          <div className="relative">
            <Input
              id={id}
              name={name}
              type={showPassword ? "text" : "password"}
              value={value}
              onChange={onChange}
              placeholder={placeholder || ""}
              disabled={forEdit}
              className={cn(inputClassName)}
              autoComplete="off"
              {...otherProps}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-2 right-2 text-muted-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {renderError()}
        </div>
      );

    case "file":
      return (
        <div className="w-full">
          {label && (
            <Label htmlFor={id} className={labelClassName}>
              {label}
            </Label>
          )}
          <Input
            type="file"
            id={id}
            name={name}
            multiple={multiple}
            onChange={onChange}
            className={cn(inputClassName)}
            {...otherProps}
          />
          {renderError()}
        </div>
      );
    case "textArea":
      return (
        <div className="w-full space-y-3">
          {label && (
            <div className="flex">
              <Label htmlFor={id} className={`${labelClassName} text-md`}>
                {label}
              </Label>
              {required ? <i className="text-red-500 h-0 w-0">*</i> : null}
            </div>
          )}
          <Textarea
            id={id}
            name={name}
            value={value}
            placeholder={placeholder || ""}
            onChange={onChange}
            disabled={forEdit}
            className={cn(inputClassName)}
            {...otherProps}
          />
          {renderError()}
        </div>
      );
    case "checkbox":
      return (
        <div className="flex">
          <Checkbox
            id={id}
            className="cursor-pointer border-primary border-2 mr-1 data-[state=checked]:text-white"
            onCheckedChange={onCheckedChange}
            defaultChecked={checkboxDefaultValue}
          />
          <label
            htmlFor={id}
            className="text-sm font-medium cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        </div>
      );
    default:
      return (
        <div className="w-full space-y-2.5 relative">
          {label && (
            <div className="flex">
              <Label htmlFor={id} className={`${labelClassName}`}>
                {label}
                {required ? <span className="text-red-500">*</span> : null}
              </Label>
            </div>
          )}

          <Input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder || ""}
            disabled={forEdit}
            autoComplete="off"
            className={cn(
              "border",
              errors
                ? "border-red-500 focus:border-red-500 focus-visible:border-red-500 focus-visible:ring-red-300 focus-visible:ring-[1px]"
                : "",
              inputClassName
            )}
            {...otherProps}
          />
          {renderError()}
        </div>
      );
  }
};

export default CustomInput;
