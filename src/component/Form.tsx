import { zodResolver } from "@hookform/resolvers/zod";
import {
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  Controller,
  Control,
  useWatch,
  UseFormSetValue,
} from "react-hook-form";
import * as z from "zod";
import Select from "react-select";
import { useEffect, useRef } from "react";

const formSchema = z.object({
  name: z.string().min(6, { message: "Minimum length required is 6" }),
  age: z
    .number({ invalid_type_error: "this is required" })
    .min(20, { message: "age should be greater than 20" }),
  email: z.string().email({ message: "should be an valid email" }),
  hobby: z.object({
    label: z
      .string({ required_error: "it is required" })
      .min(3, { message: "testing" }),
    value: z.number(),
  }),
});

type FormType = z.input<typeof formSchema>;

export const ReactHookForm = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormType>({
    defaultValues: {
      name: "",
      age: undefined,
      email: "",
      hobby: {
        label: "",
        value: undefined,
      },
    },
    mode: "onChange",
    resolver: zodResolver(formSchema),
    // shouldFocusError: true,
    // shouldUnregister: true,
  });
  const onSubmit: SubmitHandler<FormType> = (data) => {
    console.log(data, "data");
  };
  const onError: SubmitErrorHandler<FormType> = (err) => {
    console.log(err, "err");
  };
  const values = useWatch({
    control: control,
    name: "name",
  });
  const hasChanged = useCompareValue(values, (p, v) => p != v);
  console.log(hasChanged, "hasChanged");
  useEffect(() => {
    setValue && setValue("email", "");
    console.log("this is bullshit you know");
  }, [hasChanged, values]);
  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="mx-auto w-[min(500px,95vw)] p-4 "
    >
      <div className="mb-2 flex flex-col gap-2">
        <label
          htmlFor="name"
          className="flex flex-col items-stretch gap-1 font-bold"
        >
          <span>Name:</span>
          <input
            className="h-10 border-4  border-[#222] bg-[#333] indent-2 font-medium uppercase text-white opacity-95 outline-none"
            type="text"
            {...register("name")}
            id="name"
          />
        </label>
        {errors.name && (
          <p className="text-sm capitalize text-red-900">
            {errors.name.message}
          </p>
        )}
      </div>
      <div className="mb-2 flex flex-col gap-2">
        <label
          htmlFor="age"
          className="flex flex-col items-stretch gap-1 font-bold"
        >
          <span>Age:</span>
          <input
            className="h-10 border-4  border-[#222] bg-[#333] indent-2 font-medium uppercase text-white opacity-95 outline-none"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            {...register("age", { valueAsNumber: true })}
            id="age"
            maxLength={10}
            minLength={2}
          />
        </label>
        {errors.age && (
          <p className="text-sm capitalize text-red-900">
            {errors.age.message}
          </p>
        )}
      </div>
      <div className="mb-2 flex flex-col gap-2">
        <label
          htmlFor="email"
          className="flex flex-col items-stretch gap-1 font-bold"
        >
          <span>Email:</span>
          <input
            className="h-10 border-4  border-[#222] bg-[#333] indent-2 font-medium uppercase text-white opacity-95 outline-none"
            type="email"
            {...register("email")}
          />
        </label>
        {errors.email && (
          <p className="text-sm capitalize text-red-900">
            {errors.email.message}
          </p>
        )}
      </div>
      <div className="mb-2 flex flex-col gap-2">
        <label
          htmlFor="hobby"
          className="flex flex-col items-stretch gap-1 font-bold"
        >
          <span>Hobbies:</span>
          <CustomSelect control={control} name="hobby" setValue={setValue} />
        </label>
        {errors.hobby?.label && (
          <p className="text-sm capitalize text-red-900">
            {errors.hobby.label.message}
          </p>
        )}
      </div>
      <button className="mx-auto block rounded border bg-[#ff6500] px-6  py-2 text-xl font-semibold  uppercase text-white shadow-lg transition-all duration-300 ease-out active:scale-95">
        Submit
      </button>
    </form>
  );
};
type KeysMatching<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

// Update the CustomSelect component
type CustomSelectProps = {
  control: Control<FormType>;
  // name: KeysMatching<FormType, OptionType>;
  name: KeysMatching<FormType, OptionType>;
  setValue?: UseFormSetValue<FormType>;
};

const CustomSelect: React.FC<CustomSelectProps> = ({
  control,
  name,
  setValue,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select
          isClearable
          options={Hobbies}
          name={field.name}
          ref={field.ref}
          //   isMulti={false}
          value={field.value}
          onChange={(selectedOption) =>
            field.onChange(selectedOption || { label: "", value: 0 })
          }
          onBlur={field.onBlur}
        />
      )}
    />
  );
};

type OptionType = {
  label: string;
  value: number;
};

const Hobbies: OptionType[] = [
  {
    label: "Sports",
    value: 1,
  },
  {
    label: "E-Gaming",
    value: 2,
  },
  {
    label: "Books",
    value: 3,
  },
  {
    label: "Gardening",
    value: 4,
  },
];

function useCompareValue(
  value: string,
  compare: (prevValue: string, currentValue: string) => boolean
) {
  const prevValue = useRef(value);
  const hasChanged = compare(prevValue.current, value);
  useEffect(() => {
    prevValue.current = value;
  }, [value]);
  return hasChanged;
}
