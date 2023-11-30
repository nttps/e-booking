<template>
    <footer>
        <div class="bg-[#FFA133] px-10 py-6">
            <div class="font-bold text-xl">กรมป้องกันและบรรเทาสาธารณภัย กระทรวงมหาดไทย</div>
            <div class="font-bold text-xl">Department of Disaster Prevention and Mitigation. Ministry of Interior. Thailand</div>

            <div class="mt-8">
                3/12 ถ.อู่ทองนอก แขวงดุสิต เขตดุสิต กรุงเทพมหานคร 10300 <br />
                โทรศัพท์ 0-2637-3000 <br />
            </div>
            <div>DDPM - E-Learning Version {{ config.public.version }}</div>
        </div>
    </footer>
</template>

<script setup>
    const config = useRuntimeConfig();

    

</script>