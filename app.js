const SUPABASE_URL = "https://jfndjnixoimyueddhtzg.supabase.co";
const SUPABASE_KEY = "sb_publishable_3XnLxFXJLa2hPm-p3AqRdA_7mpPc1OQ";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

document.addEventListener("DOMContentLoaded", function () {

    // ==================================================
    // VEHICLE ELEMENTS
    // ==================================================

    const addVehicleButton =
        document.getElementById("addVehicleButton");

    const saveVehicleButton =
        document.getElementById("saveVehicleButton");

    const editVehicleButton =
        document.getElementById("editVehicleButton");

    const deleteVehicleButton =
        document.getElementById("deleteVehicleButton");

    const cancelButton =
        document.getElementById("cancelButton");


    const vehicleDisplay =
        document.getElementById("vehicleDisplay");

    const noVehicle =
        document.getElementById("noVehicle");

    const vehicleForm =
        document.getElementById("vehicleForm");

    const formTitle =
        document.getElementById("formTitle");


    // Main vehicle registration input
    const registrationInput =
        document.getElementById("registration");

    const makeInput =
        document.getElementById("make");

    const modelInput =
        document.getElementById("model");

    const yearInput =
        document.getElementById("year");

    const vinInput =
        document.getElementById("vin");


    // ==================================================
    // NEXT SERVICE ELEMENTS
    // ==================================================

    const nextServiceCard =
        document.getElementById("nextServiceCard");

    const nextServiceHeader =
        document.getElementById("nextServiceHeader");

    const nextServiceToggle =
        document.getElementById("nextServiceToggle");

    const nextServiceContent =
        document.getElementById("nextServiceContent");

    const savedNextService =
        document.getElementById("savedNextService");

    const nextServiceForm =
        document.getElementById("nextServiceForm");

    const nextServiceDate =
        document.getElementById("nextServiceDate");

    const nextServiceKm =
        document.getElementById("nextServiceKm");

    const nextServiceDetails =
        document.getElementById("nextServiceDetails");

    const nextServiceDateInput =
        document.getElementById("nextServiceDateInput");

    const nextServiceKmInput =
        document.getElementById("nextServiceKmInput");

    const nextServiceDetailsInput =
        document.getElementById("nextServiceDetailsInput");

    const saveNextServiceButton =
        document.getElementById("saveNextServiceButton");

    const editNextServiceButton =
        document.getElementById("editNextServiceButton");


    // ==================================================
    // REGISTRATION ELEMENTS
    // ==================================================

    const registrationCard =
        document.getElementById("registrationCard");

    const registrationHeader =
        document.getElementById("registrationHeader");

    const registrationToggle =
        document.getElementById("registrationToggle");

    const registrationContent =
        document.getElementById("registrationContent");

    const savedRegistration =
        document.getElementById("savedRegistration");

    const registrationForm =
        document.getElementById("registrationForm");


    // IMPORTANT:
    // This is deliberately called registrationDetailsInput
    // so it does not conflict with the main vehicle
    // registrationInput above.

    const registrationDetailsInput =
        document.getElementById("registrationInput");

    const registrationExpiryInput =
        document.getElementById("registrationExpiryInput");

    const registrationPeriodInput =
        document.getElementById("registrationPeriodInput");

    const saveRegistrationButton =
        document.getElementById("saveRegistrationButton");

    const editRegistrationButton =
        document.getElementById("editRegistrationButton");

    const savedRegistrationNumber =
        document.getElementById("savedRegistrationNumber");

    const savedRegistrationExpiry =
        document.getElementById("savedRegistrationExpiry");

    const savedRegistrationPeriod =
        document.getElementById("savedRegistrationPeriod");


    // ==================================================
    // GET VEHICLE
    // ==================================================

   async function getVehicle() {

    // Get tag ID from URL
    const params =
        new URLSearchParams(window.location.search);

    const tagId =
    params.get("tag");


    let query =
        supabaseClient
            .from("vehicles")
            .select("*");


    // If a tag ID exists in the URL,
    // load that specific vehicle

   if (tagId) {

    query =
        query.eq(
            "tag_id",
            tagId
        );

}


    const { data, error } =
        await query
            .limit(1)
            .maybeSingle();


    if (error) {

        console.error(
            "Error loading vehicle:",
            error.message,
            error.details,
            error.hint,
            error.code
        );

        return null;

    }


    if (!data) {

        return null;

    }


    return {

        tagId:
            data.tag_id,

        registration:
            data.registration || "",

        make:
            data.make || "",

        model:
            data.model || "",

        year:
            data.year || "",

        vin:
            data.vin || "",


        nextService: {

            date:
                data.next_service_date || "",

            km:
                data.next_service_km || "",

            details:
                data.next_service_details || ""

        },


        registrationDetails: {

            registration:
                data.registration || "",

            expiryDate:
                data.registration_expiry || "",

            renewalPeriod:
                data.registration_renewal_period || "12"

        }

    };

}


    // ==================================================
    // SAVE VEHICLE
    // ==================================================

   async function saveVehicle(vehicle) {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const tagIdFromUrl =
        params.get("tag");


    const vehicleData = {

        tag_id:
            vehicle.tagId ||
            tagIdFromUrl ||
            crypto.randomUUID(),

        registration:
            vehicle.registration,

        make:
            vehicle.make,

        model:
            vehicle.model,

        year:
            vehicle.year,

        vin:
            vehicle.vin,

        next_service_date:
            vehicle.nextService?.date || null,

        next_service_km:
            vehicle.nextService?.km || null,

        next_service_details:
            vehicle.nextService?.details || null,

        registration_expiry:
            vehicle.registrationDetails?.expiryDate || null,

        registration_renewal_period:
            vehicle.registrationDetails?.renewalPeriod || 12

    };


    let result;


    // If this tag already has a vehicle,
    // update that vehicle.

    result =
    await supabaseClient
        .from("vehicles")
        .upsert(
            vehicleData,
            {
                onConflict: "tag_id"
            }
        );


    if (result.error) {

        console.error(
            "Error saving vehicle:",
            result.error
        );

        alert(
            "Could not save the vehicle."
        );

        return false;

    }


    console.log(
        "Vehicle saved to Supabase."
    );


    return true;

}


    // ==================================================
    // DISPLAY VEHICLE
    // ==================================================

    async function displayVehicle() {

        const vehicle =
           await getVehicle();


        // No vehicle saved

        if (vehicle === null) {

    vehicleDisplay.classList.add("hidden");

    nextServiceCard.classList.add("hidden");

    registrationCard.classList.add("hidden");


    // If this is a VehicleTag URL,
    // show the vehicle registration form

    const params =
        new URLSearchParams(
            window.location.search
        );

    const tagId =
        params.get("tag");


    if (tagId) {

        formTitle.textContent =
            "Register Your Vehicle";

        registrationInput.value = "";

        makeInput.value = "";

        modelInput.value = "";

        yearInput.value = "";

        vinInput.value = "";


        noVehicle.classList.add("hidden");

        vehicleForm.classList.remove("hidden");

    } else {

        // Normal app with no vehicle

        vehicleForm.classList.add("hidden");

        noVehicle.classList.remove("hidden");

    }


    return;

}


        // Vehicle information

        document.getElementById("vehicleTitle").textContent =
            vehicle.make + " " + vehicle.model;


        document.getElementById("vehicleRego").textContent =
            vehicle.registration;


        document.getElementById("vehicleMake").textContent =
            vehicle.make;


        document.getElementById("vehicleModel").textContent =
            vehicle.model;


        document.getElementById("vehicleYear").textContent =
            vehicle.year;


        document.getElementById("vehicleVin").textContent =
            vehicle.vin || "Not entered";


        // Show vehicle

        noVehicle.classList.add("hidden");

        vehicleForm.classList.add("hidden");

        vehicleDisplay.classList.remove("hidden");

        nextServiceCard.classList.remove("hidden");

        registrationCard.classList.remove("hidden");


        // Display additional information

        displayNextService(vehicle);

        displayRegistration(vehicle);

    }


    // ==================================================
    // NEXT SERVICE
    // ==================================================

    function displayNextService(vehicle) {

        const service =
            vehicle.nextService;


        if (
            service &&
            (
                service.date ||
                service.km ||
                service.details
            )
        ) {

            savedNextService.classList.remove("hidden");

            nextServiceForm.classList.add("hidden");


            // Date

            if (service.date) {

                const date =
                    new Date(
                        service.date + "T00:00:00"
                    );


                nextServiceDate.textContent =
                    date.toLocaleDateString("en-AU");

            } else {

                nextServiceDate.textContent =
                    "Not set";

            }


            // KM

            if (service.km) {

                nextServiceKm.textContent =
                    Number(service.km).toLocaleString()
                    + " km";

            } else {

                nextServiceKm.textContent =
                    "Not set";

            }


            // Details

            nextServiceDetails.textContent =
                service.details ||
                "Not specified";

        } else {

            savedNextService.classList.add("hidden");

            nextServiceForm.classList.remove("hidden");

        }

    }


    // ==================================================
    // NEXT SERVICE DROPDOWN
    // ==================================================

    nextServiceHeader.onclick = function () {

        const isHidden =
            nextServiceContent.classList.contains("hidden");


        if (isHidden) {

            nextServiceContent.classList.remove("hidden");

            nextServiceToggle.textContent = "−";

        } else {

            nextServiceContent.classList.add("hidden");

            nextServiceToggle.textContent = "+";

        }

    };


    nextServiceToggle.onclick = function (event) {

        event.stopPropagation();

    };


    // ==================================================
    // EDIT NEXT SERVICE
    // ==================================================

    editNextServiceButton.onclick = async function (event) {

        event.stopPropagation();


        const vehicle =
            await getVehicle();


        if (vehicle === null) {
            return;
        }


        nextServiceDateInput.value =
            vehicle.nextService.date || "";


        nextServiceKmInput.value =
            vehicle.nextService.km || "";


        nextServiceDetailsInput.value =
            vehicle.nextService.details || "";


        savedNextService.classList.add("hidden");

        nextServiceForm.classList.remove("hidden");

    };


    // ==================================================
    // SAVE NEXT SERVICE
    // ==================================================

    saveNextServiceButton.onclick = async function () {

        const vehicle =
           await getVehicle();


        if (vehicle === null) {
            return;
        }


        if (
            nextServiceDateInput.value === "" &&
            nextServiceKmInput.value === "" &&
            nextServiceDetailsInput.value.trim() === ""
        ) {

            alert(
                "Please enter at least one service detail."
            );

            return;

        }


        vehicle.nextService = {

            date:
                nextServiceDateInput.value,

            km:
                nextServiceKmInput.value,

            details:
                nextServiceDetailsInput.value.trim()

        };


        const saved =
    await saveVehicle(vehicle);


if (saved) {

    displayVehicle();

}

    };


    // ==================================================
    // REGISTRATION
    // ==================================================

    function displayRegistration(vehicle) {

        const registration =
            vehicle.registrationDetails;


        // Keep registration automatically synced
        // with the main vehicle registration

        if (
            vehicle.registration &&
            registration.registration !== vehicle.registration
        ) {

            registration.registration =
                vehicle.registration;

            saveVehicle(vehicle);

        }


        // No expiry date saved yet

        if (!registration.expiryDate) {

            savedRegistration.classList.add("hidden");

            registrationForm.classList.remove("hidden");


            // Automatically fill from main vehicle

            registrationDetailsInput.value =
                vehicle.registration || "";


            return;

        }


        // ==================================================
        // AUTO RENEW EXPIRED REGISTRATION
        // ==================================================

        let expiryDate =
            new Date(
                registration.expiryDate + "T00:00:00"
            );


        const renewalMonths =
            Number(
                registration.renewalPeriod
            ) || 12;


        const today =
            new Date();


        today.setHours(
            0,
            0,
            0,
            0
        );


        // Keep extending the expiry date until
        // it is in the future.

        while (expiryDate < today) {

            expiryDate.setMonth(
                expiryDate.getMonth() +
                renewalMonths
            );

        }


        // Convert date back to YYYY-MM-DD

        const year =
            expiryDate.getFullYear();


        const month =
            String(
                expiryDate.getMonth() + 1
            ).padStart(2, "0");


        const day =
            String(
                expiryDate.getDate()
            ).padStart(2, "0");


        const updatedExpiry =
            `${year}-${month}-${day}`;


        // Save changed expiry date

        if (
            updatedExpiry !==
            registration.expiryDate
        ) {

            registration.expiryDate =
                updatedExpiry;

            saveVehicle(vehicle);

        }


        // ==================================================
        // DISPLAY SAVED REGISTRATION
        // ==================================================

        savedRegistration.classList.remove("hidden");

        registrationForm.classList.add("hidden");


        savedRegistrationNumber.textContent =
            registration.registration ||
            "Not set";


        const displayDate =
            new Date(
                registration.expiryDate +
                "T00:00:00"
            );


        savedRegistrationExpiry.textContent =
            displayDate.toLocaleDateString(
                "en-AU"
            );


        savedRegistrationPeriod.textContent =
            renewalMonths +
            " months";

    }


    // ==================================================
    // REGISTRATION DROPDOWN
    // ==================================================

    registrationHeader.onclick = function () {

        const isHidden =
            registrationContent.classList.contains("hidden");


        if (isHidden) {

            registrationContent.classList.remove("hidden");

            registrationToggle.textContent = "−";

        } else {

            registrationContent.classList.add("hidden");

            registrationToggle.textContent = "+";

        }

    };


    registrationToggle.onclick = function (event) {

        event.stopPropagation();

    };


    // ==================================================
    // SAVE REGISTRATION
    // ==================================================

    saveRegistrationButton.onclick = async function () {

        const vehicle =
           await getVehicle();


        if (vehicle === null) {
            return;
        }


        const registration =
            registrationDetailsInput.value
                .trim()
                .toUpperCase();


        // Check registration

        if (registration === "") {

            alert(
                "Please enter the registration."
            );

            return;

        }


        // Check expiry date

        if (
            registrationExpiryInput.value === ""
        ) {

            alert(
                "Please enter the registration expiry date."
            );

            return;

        }


        // Save registration details

        vehicle.registrationDetails = {

            registration:
                registration,

            expiryDate:
                registrationExpiryInput.value,

            renewalPeriod:
                registrationPeriodInput.value

        };


        // Also update the main vehicle registration

        vehicle.registration =
            registration;


        await saveVehicle(vehicle);


        // Refresh vehicle

        await displayVehicle();


        // Keep Registration section open

        registrationContent.classList.remove(
            "hidden"
        );

        registrationToggle.textContent =
            "−";

    };


    // ==================================================
    // EDIT REGISTRATION
    // ==================================================

    editRegistrationButton.onclick = async function (event) {

        event.stopPropagation();


        const vehicle =
           await getVehicle();


        if (vehicle === null) {
            return;
        }


        const registration =
            vehicle.registrationDetails;


        registrationDetailsInput.value =
            registration.registration ||
            vehicle.registration ||
            "";


        registrationExpiryInput.value =
            registration.expiryDate ||
            "";


        registrationPeriodInput.value =
            registration.renewalPeriod ||
            "12";


        savedRegistration.classList.add("hidden");

        registrationForm.classList.remove("hidden");

    };


    // ==================================================
    // SAVE VEHICLE
    // ==================================================

   saveVehicleButton.onclick = async function () {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const tagId =
        params.get("tag");


    const vehicle = {

        tagId:
            tagId,

        registration:
            registrationInput.value.trim().toUpperCase(),

        make:
            makeInput.value.trim(),

        model:
            modelInput.value.trim(),

        year:
            yearInput.value.trim(),

        vin:
            vinInput.value.trim(),


        nextService:
            {
                date: "",
                km: "",
                details: ""
            },


        registrationDetails:
            {
                registration:
                    registrationInput.value
                        .trim()
                        .toUpperCase(),

                expiryDate: "",

                renewalPeriod: "12"
            }

    };


    // Required information

    if (
        vehicle.registration === "" ||
        vehicle.make === "" ||
        vehicle.model === ""
    ) {

        alert(
            "Please enter the registration, make and model."
        );

        return;

    }


    // Save to Supabase

    const saved =
        await saveVehicle(vehicle);


    if (!saved) {

        return;

    }


    // Reload vehicle from Supabase

    const updatedVehicle =
        await getVehicle();


    if (updatedVehicle) {

        displayVehicle();

    } else {

        alert(
            "Vehicle was saved, but could not be loaded back from Supabase."
        );

    }

};


    // ==================================================
    // ADD VEHICLE
    // ==================================================

    addVehicleButton.onclick = function () {

        formTitle.textContent =
            "Add Vehicle";


        registrationInput.value = "";

        makeInput.value = "";

        modelInput.value = "";

        yearInput.value = "";

        vinInput.value = "";


        noVehicle.classList.add("hidden");

        vehicleDisplay.classList.add("hidden");

        nextServiceCard.classList.add("hidden");

        registrationCard.classList.add("hidden");

        vehicleForm.classList.remove("hidden");

    };


    // ==================================================
    // EDIT VEHICLE
    // ==================================================

    editVehicleButton.onclick = function () {

        const vehicle =
            getVehicle();


        if (vehicle === null) {
            return;
        }


        formTitle.textContent =
            "Edit Vehicle";


        registrationInput.value =
            vehicle.registration || "";


        makeInput.value =
            vehicle.make || "";


        modelInput.value =
            vehicle.model || "";


        yearInput.value =
            vehicle.year || "";


        vinInput.value =
            vehicle.vin || "";


        vehicleDisplay.classList.add("hidden");

        nextServiceCard.classList.add("hidden");

        registrationCard.classList.add("hidden");

        vehicleForm.classList.remove("hidden");

    };


    // ==================================================
    // CANCEL
    // ==================================================

    cancelButton.onclick = function () {

        displayVehicle();

    };


   // ==================================================
// DELETE VEHICLE
// ==================================================

deleteVehicleButton.onclick = async function () {

    const confirmed =
        confirm(
            "Are you sure you want to delete this vehicle?"
        );


    if (!confirmed) {
        return;
    }


    const { data: vehicle, error: findError } =
        await supabaseClient
            .from("vehicles")
            .select("tag_id")
            .limit(1)
            .maybeSingle();


    if (findError) {

        console.error(
            "Error finding vehicle:",
            findError
        );

        alert(
            "Could not find the vehicle."
        );

        return;

    }


    if (!vehicle) {

        await displayVehicle();

        return;

    }


    const { error: deleteError } =
        await supabaseClient
            .from("vehicles")
            .delete()
            .eq("tag_id", vehicle.tag_id);


    if (deleteError) {

        console.error(
            "Error deleting vehicle:",
            deleteError
        );

        alert(
            "Could not delete the vehicle."
        );

        return;

    }


    await displayVehicle();

};


    // ==================================================
    // START APP
    // ==================================================

    displayVehicle();
// ==================================================
// DARK MODE
// ==================================================

const darkModeToggle =
    document.getElementById("darkModeToggle");


const savedDarkMode =
    localStorage.getItem("darkMode");


if (savedDarkMode === "enabled") {

    document.body.classList.add("dark-mode");

    darkModeToggle.textContent =
        "☀️ Light Mode";

}


darkModeToggle.onclick = function () {

    document.body.classList.toggle(
        "dark-mode"
    );


    if (
        document.body.classList.contains(
            "dark-mode"
        )
    ) {

        localStorage.setItem(
            "darkMode",
            "enabled"
        );

        darkModeToggle.textContent =
            "☀️ Light Mode";

    } else {

        localStorage.setItem(
            "darkMode",
            "disabled"
        );

        darkModeToggle.textContent =
            "🌙 Dark Mode";

    }

};
});
