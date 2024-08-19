<script>
    import { Checkbox } from "$components";
    export let checked = false;
    export let text = '';
    const checkboxId = `checkbox-${Math.random().toString(36).substring(2, 9)}`;
</script>

<li class="flex items-center gap-2 list-none">
    <Checkbox id={checkboxId} bind:checked />
    <label for={checkboxId}>
        {text}
    </label>
</li>
