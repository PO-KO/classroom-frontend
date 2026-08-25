import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { CreateView } from "@/components/refine-ui/views/create-view";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BaseRecord, HttpError, useBack } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { classSchema } from "@/lib/schema";
import { toast } from "sonner";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CLASS_STATUS } from "@/providers/constants";
import { Loader2 } from "lucide-react";
import UploadWidget from "@/components/UploadWidget";

const teachers = [
  { id: "teacher-1", name: "Dr. Sarah Connor" },
  { id: "teacher-2", name: "Prof. Alan Turing" },
  { id: "teacher-3", name: "Dr. Ada Lovelace" },
  { id: "teacher-4", name: "Prof. Richard Feynman" },
];
const subjects = [
  { id: 1, name: "Mathematics", code: "MATH" },
  { id: 2, name: "Computer Science", code: "CS" },
  { id: 3, name: "Physics", code: "PHYS" },
  { id: 4, name: "Artificial Intelligence", code: "AI" },
  { id: 5, name: "Database Systems", code: "DBS" },
];

const ClassesCreate = () => {
  const back = useBack();
  const form = useForm<BaseRecord, HttpError, z.infer<typeof classSchema>>({
    resolver: zodResolver(classSchema),
    refineCoreProps: {
      resource: "classes",
      action: "create",
    },
    defaultValues: {
      name: "",
      description: "",
      teacherId: "",
      subjectId: undefined,
      status: "active",
      capacity: 30,
    },
  });

  const setBannerImage = (file: any, field: any) => {
    if (file) {
      field.onChange(file.url);
      form.setValue("bannerCldPubId", file.publicId, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      field.onChange("");
      form.setValue("bannerCldPubId", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const MAX_DESC_LENGTH = 200;
  const bannerPublicId = form.watch("bannerCldPubId");
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = form;

  const onSubmit = async (data: z.infer<typeof classSchema>) => {
    try {
      await form.refineCore.onFinish(data);
      toast.success("Class created successfully!");
    } catch (error: unknown) {
      console.error("Submission failed:", error);

      toast.error("Failed to create class", {
        description:
          (error as Error | HttpError)?.message ||
          "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <CreateView className="class-view">
      <Breadcrumb />
      <h1 className="page-title">Create a Class</h1>
      <div className="intro-row">
        <p>Fill the required fields below to add a class.</p>
        <Button onClick={back}>Go Back</Button>
      </div>

      <Separator />

      <div className="my-4 flex items-center">
        <Card className="class-form-card">
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl pb-0 font-bold">
              Fill out the form
            </CardTitle>
          </CardHeader>

          <Separator />

          <CardContent className="mt-7">
            <form
              onSubmit={handleSubmit(onSubmit)}
              id="class-form"
              className="space-y-5"
            >
              <FieldGroup>
                <Controller
                  name="bannerUrl"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Banner Image
                        <span className="text-orange-600">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <UploadWidget
                          value={
                            field.value
                              ? {
                                  url: field.value,
                                  publicId: bannerPublicId ?? "",
                                }
                              : null
                          }
                          onChange={(file) => setBannerImage(file, field)}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                        {errors.bannerCldPubId && !errors.bannerUrl && (
                          <FieldError errors={[errors.bannerCldPubId]} />
                        )}
                      </FieldContent>
                    </Field>
                  )}
                />
                <Controller
                  name="name"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Name<span className="text-orange-600">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Introduction to Algorithms"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Controller
                    name="teacherId"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Teacher
                          <span className="text-orange-600">*</span>
                        </FieldLabel>
                        <Select
                          name={field.name}
                          value={field.value?.toString()}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            className="min-w-[120px]"
                          >
                            <SelectValue placeholder="Select a Teacher" />
                          </SelectTrigger>
                          <SelectContent position="item-aligned">
                            {teachers.map(({ id, name }) => (
                              <SelectItem key={id} value={id.toString()}>
                                {name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="subjectId"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Subject
                          <span className="text-orange-600">*</span>
                        </FieldLabel>
                        <Select
                          name={field.name}
                          value={field.value?.toString() ?? ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            className="min-w-[120px]"
                          >
                            <SelectValue placeholder="Select a Subject" />
                          </SelectTrigger>
                          <SelectContent position="item-aligned">
                            {subjects.map(({ id, code, name }) => (
                              <SelectItem key={id} value={id.toString()}>
                                {name} ({code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="capacity"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Capacity<span className="text-orange-600">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            field.onChange(value ? Math.abs(value) : undefined);
                          }}
                          // value={(field.value as number | undefined) ?? ""}
                          id={field.name}
                          type="number"
                          aria-invalid={fieldState.invalid}
                          placeholder="30"
                          autoComplete="off"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="status"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Status<span className="text-orange-600">*</span>
                        </FieldLabel>
                        <Select
                          name={field.name}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            className="min-w-[120px]"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent position="item-aligned">
                            <SelectItem value={CLASS_STATUS.ACTIVE}>
                              Active
                            </SelectItem>
                            <SelectItem value={CLASS_STATUS.INACTIVE}>
                              Inactive
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  />
                </div>
                <Controller
                  name="description"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Description
                        <span className="text-orange-600">*</span>
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupTextarea
                          {...field}
                          onChange={(e) => {
                            const value =
                              e.target.value.length <= MAX_DESC_LENGTH
                                ? e.target.value
                                : e.target.value.slice(0, MAX_DESC_LENGTH);
                            field.onChange(value);
                          }}
                          id={field.name}
                          placeholder="Brief description about the class."
                          rows={6}
                          className="min-h-24 resize-none"
                          aria-invalid={fieldState.invalid}
                        />
                        <InputGroupAddon align="block-end">
                          <InputGroupText className="tabular-nums">
                            {field.value ? field.value.length : 0}/
                            {MAX_DESC_LENGTH} characters
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter>
            <Field orientation="horizontal">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button type="submit" form="class-form" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex gap-1">
                    <span>Creating Class...</span>
                    <Loader2 className="inline-block ml-2 animate-spin" />
                  </div>
                ) : (
                  "Create Class"
                )}
              </Button>
            </Field>
          </CardFooter>
        </Card>
      </div>
    </CreateView>
  );
};

export default ClassesCreate;
