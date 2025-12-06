import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import clsx from "clsx"
import { twMerge } from "tailwind-merge"

/* Using vanilla CSS classes from globals.css inside these utility wrappers is one option,
   but since cva/clsx/tailwind-merge are typical for Tailwind, I will adapt them to work with my custom CSS classes
   or standard style props?
   Actually, the user requested Vanilla CSS for flexibility but Tailwind is installed in the request?
   Wait, "Use Vanilla CSS ... Avoid using TailwindCSS unless the USER explicitly requests it".
   However, my setup command had `--no-tailwind`.
   So I CANNOT use tailwind classes. I must use my global css classes.
   But I installed `clsx` and `cva` which are fine for class composition.
   I should not use `tailwind-merge` if there is no tailwind.
   I will write standard React components using the global classes.
*/

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' }>(
    ({ className, variant = 'primary', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={clsx('btn', `btn-${variant}`, className)}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className, ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={clsx('input', className)}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
    ({ className, ...props }, ref) => {
        return (
            <label
                ref={ref}
                className={clsx('label', className)}
                {...props}
            />
        )
    }
)
Label.displayName = "Label"

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                className={clsx('input', className)}
                {...props}
            />
        )
    }
)
Textarea.displayName = "Textarea"
