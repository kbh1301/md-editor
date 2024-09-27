import Root from "./button.svelte";
import { tv, type VariantProps } from "tailwind-variants";
import type { Button as ButtonPrimitive } from "bits-ui";

const buttonVariants = tv({
	base: "inline-flex items-center justify-center rounded-md text-sm font-medium whitespace-nowrap ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-2 active:scale-95",
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
			outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground hover:bg-primary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline",

            toolbar: "text-foreground hover:bg-foreground/10",
            toolbar_edit: "bg-primary text-primary-foreground hover:bg-primary-foreground/30",
            secondary_plus: "bg-secondary text-secondary-foreground hover:bg-primary/80 text-lg font-semibold shadow-2xl py-7",
            icon_primary: "text-primary hover:text-primary/80",
            icon_secondary: "text-secondary hover:text-secondary/80",
            muted: "bg-muted-foreground text-background hover:bg-muted-foreground/80"
		},
		size: {
			default: "h-10 px-4 py-2",
            xs: "h-5 rounded-md px-1",
			sm: "h-9 rounded-md px-3",
			lg: "h-11 rounded-lg px-8",
			icon: "h-8 w-8 flex [&>svg]:h-8 [&>svg]:w-8",
            toolbar: "h-full w-auto rounded-none py-1.5 px-3 text-md cursor-default",
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});

type Variant = VariantProps<typeof buttonVariants>["variant"];
type Size = VariantProps<typeof buttonVariants>["size"];

type Props = ButtonPrimitive.Props & {
	variant?: Variant;
	size?: Size;
};

type Events = ButtonPrimitive.Events;

export {
	Root,
	type Props,
	type Events,
	//
	Root as Button,
	type Props as ButtonProps,
	type Events as ButtonEvents,
	buttonVariants
};
