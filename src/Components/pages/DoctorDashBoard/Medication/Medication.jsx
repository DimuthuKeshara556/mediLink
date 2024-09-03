import React, { useState, useEffect } from "react";
import addIcon from "../../../../assets/Icons/DocIcon/addIcon.svg";
import editIcon from "../../../../assets/Icons/DocIcon/edit.svg";
import deleteIcon from "../../../../assets/Icons/DocIcon/remove_circle_outline.svg";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "../../../../Firebase/firebase";

const MedicationForm = ({ onSave, onCancel, initialData }) => {
  const [availableDaye, setAvailableDaye] = useState(
    initialData?.availableDaye || ""
  );
  const [medicationName, setMedicationName] = useState(
    initialData?.medicationName || ""
  );
  const [dosage, setDosage] = useState(initialData?.dosage || "");
  const [dosagePerEveryHours, setDosagePerEveryHours] = useState(
    initialData?.dosagePerEveryHours || ""
  );
  const [dosagePerHour, setDosagePerHour] = useState(
    initialData?.dosagePerHour || ""
  );

  const handleSave = () => {
    onSave({
      availableDaye,
      medicationName,
      dosage,
      unit,
      frequency,
      whenToTake,
    });
  };

  const [customMedication, setCustomMedication] = useState("");
  const [whenToTake, setWhenToTake] = useState("anytime");
  const [selectedMedication, setSelectedMedication] = useState("");
  const [unit, setUnit] = useState("");
  const [frequency, setFrequency] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  const medicationCategories = {
    Fever: ["Aspirin", "Ibuprofen", "Acetaminophen", "Naproxen", "Diclofenac"],
    Antibiotics: [
      "Amoxicillin",
      "Ciprofloxacin",
      "Doxycycline",
      "Azithromycin",
      "Metronidazole",
    ],
    "Pain Relief": [
      "Paracetamol",
      "Naproxen",
      "Diclofenac",
      "Codeine",
      "Tramadol",
    ],
    "Allergy Relief": [
      "Loratadine",
      "Cetirizine",
      "Diphenhydramine",
      "Fexofenadine",
      "Levocetirizine",
    ],
    "Blood Pressure": [
      "Lisinopril",
      "Amlodipine",
      "Losartan",
      "Metoprolol",
      "Valsartan",
    ],
    "Cholesterol Control": [
      "Atorvastatin",
      "Simvastatin",
      "Rosuvastatin",
      "Pravastatin",
      "Lovastatin",
    ],
    "Diabetes Management": [
      "Metformin",
      "Glipizide",
      "Insulin",
      "Sitagliptin",
      "Pioglitazone",
    ],
    Asthma: [
      "Albuterol",
      "Budesonide",
      "Fluticasone",
      "Montelukast",
      "Salmeterol",
    ],
    "Stomach Issues": [
      "Omeprazole",
      "Lansoprazole",
      "Ranitidine",
      "Pantoprazole",
      "Esomeprazole",
    ],
    "Mental Health": [
      "Sertraline",
      "Fluoxetine",
      "Citalopram",
      "Escitalopram",
      "Venlafaxine",
    ],
  };

  const dosageFrequencies = [
    "Every 4 hours",
    "Every 6 hours",
    "Every 8 hours",
    "Every 12 hours",
    "Once daily",
    "Twice daily",
  ];
  const handleMedicationChange = (e) => {
    const value = e.target.value;
    setSelectedMedication(value);

    if (value === "custom") {
      setIsCustom(true);
    } else {
      setIsCustom(false);
      setMedicationName(value);
    }
  };

  return (
    <div className="w-full rounded-lg overflow-hidden text-[15px]">
      <div className="p-5 w-full flex flex-col gap-6">
        <div>
          <label htmlFor="category" className="block mb-2">
            Category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedMedication("");
            }}
            className="w-full p-2 rounded-xl border border-gray-300"
          >
            <option value="">Select Category</option>
            {Object.keys(medicationCategories).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        {selectedCategory && (
          <div className="flex w-full gap-2">
            <div className="w-2/3">
              <label htmlFor="medication" className="block mb-2">
                Medication
              </label>
              <select
                id="medication"
                value={selectedMedication}
                onChange={handleMedicationChange}
                className="w-full p-2 border rounded-xl border-gray-300"
              >
                <option value="">Select Medication</option>
                {medicationCategories[selectedCategory].map((med) => (
                  <option key={med} value={med}>
                    {med}
                  </option>
                ))}
                <option value="custom">Other (specify)</option>
              </select>
            </div>

            <div className="flex flex-col">
              {selectedMedication === "custom" && (
                <input
                  type="text"
                  placeholder="Enter custom medication"
                  value={customMedication}
                  onChange={(e) => setMedicationName(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-300 mt-8 mb-3"
                />
              )}
              <label htmlFor="unit" className="block mb-2">
                Available for
              </label>
              <select
                id="unit"
                value={availableDaye}
                onChange={(e) => setAvailableDaye(e.target.value)}
                className="w-full p-2 rounded-xl border border-gray-300"
              >
                <option value="">Available</option>
                <option value="7">7</option>
                <option value="14">14</option>
                <option value="21">21</option>
              </select>
            </div>
          </div>
        )}
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="dosage" className="block mb-2">
              Dosage
            </label>
            <input
              type="number"
              id="dosage"
              placeholder="e.g. 500"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="w-full p-2 rounded-xl border border-gray-300"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="unit" className="block mb-2">
              Unit
            </label>
            <select
              id="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full p-2 rounded-xl border border-gray-300"
            >
              <option value="">Unit</option>
              <option value="mg">mg</option>
              <option value="ml">ml</option>
              <option value="tablet">tablet</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="frequency" className="block mb-2">
            Frequency
          </label>
          <select
            id="frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full p-2 rounded-xl border border-gray-300"
          >
            <option value="">Select Frequency</option>
            {dosageFrequencies.map((freq) => (
              <option key={freq} value={freq}>
                {freq}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">When to take</label>
          <div className="flex gap-4">
            {["Before meal", "After meal", "Anytime"].map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="whenToTake"
                  value={option.toLowerCase().replace(" ", "")}
                  checked={whenToTake === option.toLowerCase().replace(" ", "")}
                  onChange={(e) => setWhenToTake(e.target.value)}
                  className="form-radio"
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="w-1/2 rounded-full p-2 text-[14px] border-2 bg-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="w-1/2 bg-blue-500 text-white rounded-full p-2 text-[14px]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const Medication = ({ userId }) => {
  const [medications, setMedications] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentMedication, setCurrentMedication] = useState(null);

  useEffect(() => {
    const fetchMedications = async () => {
      const userRef = doc(firestore, "medications", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        setMedications(userDoc.data().medications || []);
      }
    };

    fetchMedications();
  }, [userId]);

  const handleSave = async (medication) => {
    const updatedMedications = currentMedication
      ? medications.map((m) => (m.id === currentMedication.id ? medication : m))
      : [...medications, { ...medication, id: new Date().toISOString() }];

    const userRef = doc(firestore, "medications", userId);
    await setDoc(userRef, { medications: updatedMedications }, { merge: true });

    setMedications(updatedMedications);
    setIsFormOpen(false);
    setCurrentMedication(null);
    // alert("success")
  };

  const handleDelete = async (id) => {
    const updatedMedications = medications.filter((m) => m.id !== id);
    const userRef = doc(firestore, "medications", userId);
    await setDoc(userRef, { medications: updatedMedications }, { merge: true });

    setMedications(updatedMedications);
  };

  return (
    <div className="w-full p-4 max-w-md bg-white rounded-3xl border-2 shadow-md space-y-4">
      {medications.map((medication) => (
        <div key={medication.id} className="p-4 mb-4">
          <p className="flex items-end justify-end font-medium text-[10px] text-lightblueButton mb-1">{`Available ${medication.availableDaye} days`}</p>
          <div className="flex gap-2 items-center justify-between text-[15px]">
            <p className="font-semibold">{medication.medicationName}</p>
            <p>
              {medication.dosage} {medication.unit}
            </p>
            <p>{medication.frequency}</p>
            <div className="flex space-x-4 mt-2">
              <img
                className="w-[18px] cursor-pointer"
                onClick={() => {
                  setCurrentMedication(medication);
                  setIsFormOpen(true);
                }}
                src={editIcon}
                alt="Edit"
              />
              <img
                onClick={() => handleDelete(medication.id)}
                className="w-[18px] cursor-pointer"
                src={deleteIcon}
                alt="Delete"
              />
            </div>
          </div>
        </div>
      ))}
      {isFormOpen && (
        <MedicationForm
          initialData={currentMedication}
          onSave={handleSave}
          onCancel={() => {
            setIsFormOpen(false);
            setCurrentMedication(null);
          }}
        />
      )}
      {!isFormOpen && (
        <div className="w-full flex items-center justify-between">
          <p
            className={`text-gray-400 text-[13px] font-semibold ${
              isFormOpen ? "hidden" : "flex"
            }`}
          >
            Tap the button to begin enter the medication...
          </p>
          <img
            onClick={() => {
              setCurrentMedication(null);
              setIsFormOpen(true);
            }}
            className="cursor-pointer w-[30px]"
            src={addIcon}
            alt="Add"
          />
        </div>
      )}
    </div>
  );
};

export default Medication;
