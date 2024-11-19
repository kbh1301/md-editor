<script lang="ts">
    import { BtnOpenFile, BtnNewFile } from "$components";
</script>

<div class="markdown-body flex flex-col items-center justify-center box-border w-full min-w-[200px] max-w-[980px] my-0 p-[45px] overflow-auto rounded-lg drop-shadow-md flex-[1_1_50%]">
    <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl !mb-10">md-editor</h1>
    <div class="flex flex-col gap-4">
        <BtnOpenFile />
        <BtnNewFile />
    </div>
</div>
