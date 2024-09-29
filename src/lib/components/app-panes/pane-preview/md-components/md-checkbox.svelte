<script>
    import { Checkbox } from "$components";
    export let checked = false;
</script>

<Checkbox
    class="cursor-auto hover:!bg-primary/50 -ml-5"
    bind:checked
/>
