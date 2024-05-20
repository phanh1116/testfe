import * as React from "react";
import { format, isValid, parse } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function DatePickerInput({ prop, value, action }) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(
    format(value ? value : new Date(), "y-MM-dd")
  );

  const handleInputChange = (e) => {
    setInputValue(e.currentTarget.value);
    const date = parse(e.currentTarget.value, "y-MM-dd", new Date());
    if (isValid(date)) {
      action(prop, date);
    } else {
      action(prop, undefined);
    }
  };

  const handleSelectDate = useCallback((selected) => {
    action(prop, selected);
    if (selected) {
      setOpen(false);
      setInputValue(format(selected, "y-MM-dd"));
    } else {
      setInputValue("");
    }
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <fieldset className="relative">
        <Input
          placeholder="YYYY-MM-DD"
          value={inputValue}
          onChange={handleInputChange}
        />
        <PopoverTrigger asChild>
          <Button
            aria-label="Pick a date"
            variant={"secondary"}
            className={cn(
              "absolute right-1.5 top-1/2 h-7 -translate-y-1/2 rounded-sm border px-2 font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
      </fieldset>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          defaultMonth={value}
          selected={value}
          onSelect={handleSelectDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
