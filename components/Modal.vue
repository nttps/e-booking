<template>
    <div>
        <div class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
            <div class="relative w-auto my-6 mx-auto min-w-[80%] w-">
                <!--content-->
                <div class="border-0 rounded-lg relative flex flex-col w-full bg-white outline-none focus:outline-none px-8">
                    <div class="border-0 rounded-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        
                        <!--header-->
                        <div class="py-5 mb-4 border-b border-solid border-slate-200 rounded-t">
                            <h3 class="text-xl font-semibold"><slot name="title" /></h3>
                        </div>
                        <!--body-->
                        <div class="relative flex-auto">
                            <slot name="content" />
                           
                        </div>
                        <!--footer-->
                        <div class="flex items-center justify-end py-6 border-t border-solid border-slate-200 rounded-b">
                            <button class="text-white bg-[#FFA133] border border-solid hover:border-[#BFBFBF] hover:bg-white hover:text-[#FFA133] rounded-[20px] px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" @click="$emit('submit')">บันทึก </button>
                            <button class="text-[#BCBCBC] border border-solid border-[#BFBFBF] hover:bg-[#FFA133] hover:text-white text-sm px-6 py-2 rounded-[20px] outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" @click="$emit('close-modal')">ยกเลิก </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </div>

</template>

<script setup>
const emit = defineEmits(["submit", "close-modal"]);

</script>

<style lang="scss" scoped>

</style>