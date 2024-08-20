<script>
    import { Checkbox } from "$components";
    export let checked = false;
    export let text = '';
    const checkboxId = `checkbox-${Math.random().toString(36).substring(2, 9)}`;
</script>

<li class="flex items-center gap-2 list-none">
    <Checkbox
        id={checkboxId}
        class="cursor-auto hover:!bg-primary/50"
        bind:checked
    />
    <label
        for={checkboxId}
        class="cursor-auto"
        class:line-through={checked}
    >
        {text}
    </label>
</li>
