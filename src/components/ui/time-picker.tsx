import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Clock } from "lucide-react"

interface TimePickerProps {
  value?: string
  onChange: (time: string) => void
  placeholder?: string
  className?: string
}

export function TimePicker({ value, onChange, placeholder = "選擇時間", className }: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

  const [selectedHour, selectedMinute] = value ? value.split(':') : ['09', '00']

  const handleTimeSelect = (hour: string, minute: string) => {
    const time = `${hour}:${minute}`
    onChange(time)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          <div className="border-r">
            <div className="px-3 py-2 text-sm font-medium border-b">時</div>
            <div className="max-h-48 overflow-y-auto">
              {hours.map((hour) => (
                <button
                  key={hour}
                  className={cn(
                    "w-full px-3 py-1 text-sm hover:bg-accent text-left",
                    selectedHour === hour && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => handleTimeSelect(hour, selectedMinute)}
                >
                  {hour}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="px-3 py-2 text-sm font-medium border-b">分</div>
            <div className="max-h-48 overflow-y-auto">
              {minutes.filter((_, i) => i % 15 === 0).map((minute) => (
                <button
                  key={minute}
                  className={cn(
                    "w-full px-3 py-1 text-sm hover:bg-accent text-left",
                    selectedMinute === minute && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => handleTimeSelect(selectedHour, minute)}
                >
                  {minute}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}