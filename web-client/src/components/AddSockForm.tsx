import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { SockSize } from "@/api/inventory/model";
import { useCreateSockMutation } from "@/api/inventory/queries";

const availableSizes: SockSize[] = ["S", "M", "LG", "XL"];

interface AddSockFormProps {
    onAddSock: (response: any) => void; // Callback to notify parent of successful submission
    onClose?: () => void; // Optional callback for modal closing
}

interface FormData {
    name: string;
    description: string;
    sizes: {
        size: SockSize;
        quantity: number;
        price: number;
    }[];
    previewImageUrl: string;
}

export default function AddSockForm({ onAddSock, onClose }: AddSockFormProps) {
    const [step, setStep] = useState(1);

    // Mutation hook to create a sock
    const { mutate: createSock } = useCreateSockMutation();

    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors, isValid },
    } = useForm<FormData>({
        mode: "onChange",
        defaultValues: {
            name: "",
            description: "",
            sizes: [],
            previewImageUrl: "",
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "sizes",
    });

    const selectedSizes = watch("sizes").map((item) => item.size);

    const onSubmit = (data: FormData) => {
        // Construct payload matching backend expectations
        const payload = {
            sock: {
                name: data.name.trim(),
                description: data.description.trim(),
                previewImageUrl: data.previewImageUrl.trim(),
            },
            variants: data.sizes.map((variant) => ({
                size: variant.size,
                price: Number(variant.price),
                quantity: Number(variant.quantity),
            })),
        };

        console.log("Payload being sent to API:", payload);

        createSock(payload, {
            onSuccess: (response) => {
                console.log("Sock created successfully:", response);
                onAddSock(response);
                onClose?.();
            },
            onError: (error: any) => {
                if (error.response?.data) {
                    console.error("Validation error from server:", error.response.data);
                } else {
                    console.error("Unexpected error:", error.message);
                }
            },
        });
    };

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 p-4 bg-white border rounded-md max-w-lg mx-auto text-black"
        >
            <h2 className="text-xl font-bold text-center">
                Add New Item - Step {step} of 3
            </h2>

            {/* Step 1: Basic Details */}
            {step === 1 && (
                <div className="space-y-4">
                    <Input
                        {...register("name", { required: "Name is required" })}
                        placeholder="Name"
                        className="w-full border-black"
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm">{errors.name.message}</p>
                    )}

                    <Input
                        {...register("description", { required: "Description is required" })}
                        placeholder="Description"
                        className="w-full border-black"
                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm">
                            {errors.description.message}
                        </p>
                    )}
                </div>
            )}

            {/* Step 2: Variants */}
            {step === 2 && (
                <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-2 text-sm font-medium text-gray-700">
                        <span>Size</span>
                        <span>Quantity</span>
                        <span>Price</span>
                        <span className="text-center"></span>
                    </div>

                    {fields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-4 gap-2 items-center">
                            <select
                                {...register(`sizes.${index}.size`, {
                                    required: "Size is required",
                                    validate: (value) => {
                                        const occurrences = selectedSizes.filter((s) => s === value).length;
                                        return occurrences <= 1 || "Size must be unique";
                                    },
                                })}
                                defaultValue={field.size || ""}
                                className="border p-2 text-black text-sm"
                            >
                                <option value="" disabled>
                                    Select Size
                                </option>
                                {availableSizes.map((size) => (
                                    <option
                                        key={size}
                                        value={size}
                                        disabled={
                                            selectedSizes.includes(size) && field.size !== size
                                        }
                                    >
                                        {size}
                                    </option>
                                ))}
                            </select>

                            <Input
                                {...register(`sizes.${index}.quantity`, {
                                    required: "Quantity is required",
                                    valueAsNumber: true,
                                    min: 1,
                                })}
                                placeholder="Quantity"
                                type="number"
                                className="border p-2 text-black"
                            />

                            <Input
                                {...register(`sizes.${index}.price`, {
                                    required: "Price is required",
                                    valueAsNumber: true,
                                    min: 0.01,
                                })}
                                placeholder="Price"
                                type="number"
                                className="border p-2 text-black"
                            />

                            <Button
                                size="icon"
                                variant="destructive"
                                onClick={() => remove(index)}
                                className="h-8 w-8 flex items-center justify-center bg-red-500 border-red-500 text-white"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full border-black text-black"
                        onClick={() => append({ size: "S", quantity: 1, price: 0 })}
                    >
                        + Add Size
                    </Button>
                </div>
            )}

            {/* Step 3: Preview Image */}
            {step === 3 && (
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-black">
                        Preview Image URL
                    </label>
                    <Input
                        {...register("previewImageUrl", {
                            required: "Image URL is required",
                            pattern: {
                                value: /^(https?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/,
                                message: "Invalid URL format",
                            },
                        })}
                        placeholder="Image URL"
                        className="w-full border-black"
                    />
                    {errors.previewImageUrl && (
                        <p className="text-red-500 text-sm">
                            {errors.previewImageUrl.message}
                        </p>
                    )}
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
                {step > 1 && (
                    <Button
                        type="button"
                        className="bg-black text-white hover:bg-gray-800 border-black"
                        onClick={prevStep}
                    >
                        Previous
                    </Button>
                )}
                {step < 3 ? (
                    <Button
                        type="button"
                        className="bg-black text-white hover:bg-gray-800 border-black"
                        onClick={nextStep}
                        disabled={!isValid}
                    >
                        Next
                    </Button>
                ) : (
                    <Button
                        type="submit"
                        className="bg-black text-white hover:bg-gray-800 border-black"
                        disabled={!isValid}
                    >
                        Submit
                    </Button>
                )}
            </div>
        </form>
    );
}
