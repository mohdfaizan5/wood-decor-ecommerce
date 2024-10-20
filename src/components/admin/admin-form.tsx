// @ts-nocheck
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@prisma/client";
import { ClipboardPen, RotateCw } from "lucide-react";
import UploadProductImageAdmin from "@/components/upload-image-admin";
import { useState } from "react";
import { toast } from "sonner";
import { CATEGORIES } from "@/lib/constants";
import { addProduct, editProduct } from "@/actions/admin.action";
import { colors_options } from "@/lib/constants";
import TiptapEditor from "@/components/tiptap-editor";
import PriceVariants from "./price-variants";
import {
  addProductFormSchema,
  ProductWithVariants,
  VariantType,
} from "@/types/validations";
import { Slider } from "../ui/slider";

type addProductFormProps = {
  actionType: "add" | "edit";
  data?: ProductWithVariants;
};

export default function AddProductForm({
  actionType,
  data,
}: addProductFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editorContent, setEditorContent] = useState(
    data?.description as string
  );
  const form = useForm<z.infer<typeof addProductFormSchema>>({
    resolver: zodResolver(addProductFormSchema),
    defaultValues: {
      title: data?.title || "",
      description: data?.description || "",
      isFeatured: data?.isFeatured || false,
      colors: data?.colors || [],
      category: data?.category || "",
      image: data?.image || "",
      rating: data?.rating || 3,
      label: data?.label || "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputImageUrl, setInputImageUrl] = useState(form.getValues("image"));
  const [variants, setVariants] = useState<VariantType[]>([]);

  async function onSubmit(values: z.infer<typeof addProductFormSchema>) {
    // alert("submitting");
    const finalValues = { ...values, image: inputImageUrl };

    setIsSubmitting(true);
    try {
      let response;
      if (actionType === "edit") {

        response = await editProduct(data!.id, { ...finalValues, variants });
        if (response.success) {
          toast.success("Successfully edited the product");
          setIsOpen(false);
        } else {
          toast.error("Something went wrong in editing the product");
        }
      } else {
        // TODO: check if it contains "default" field, if missing then throw error

        response = await addProduct({ ...finalValues, variants });
        if (response.success) {
          toast.success("Successfully added the product");
          form.reset();
          setIsOpen(false);
        } else {
          toast.error("Something went wrong in adding the product");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {actionType === "edit" ? (
          <Button variant={"secondary"} className="w-28">
            <ClipboardPen size={14} className="ml-2" />
            Edit
          </Button>
        ) : (
          <Button>Add Product</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center mb-2 text-2xl">
            {actionType === "add" ? "Add new Product" : "Edit Product"}
          </DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="eg: Lshaped Sofa"
                          {...field}
                          className="placeholder:opacity-50 focus:placeholder:opacity-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <PriceVariants
                  variants={variants}
                  setVariants={setVariants}
                  form={form}
                  data={data}
                  actionType={actionType}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Link</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Pinterest Img URL"
                          {...field}
                          value={inputImageUrl}
                          onChange={(e) => {
                            setInputImageUrl(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <UploadProductImageAdmin
                  inputImageUrl={inputImageUrl}
                  setInputImageUrl={setInputImageUrl}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <TiptapEditor
                          content={editorContent}
                          onChange={(newContent) => {
                            setEditorContent(newContent);
                            field.onChange(newContent);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-5">
                      <FormLabel>Ratings ⭐</FormLabel>
                      <FormControl>
                        <Slider
                          // {...field}
                          onValueChange={(e) => {
                            // field.onChange(e[0]);
                            form.setValue("rating", e[0]);
                          }}
                          value={[field.value]}
                          defaultValue={[3]}
                          max={5}
                          step={0.5}
                        />

                        {/* <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(Number(e.target.value));
                          }}
                          type="number"
                          step={0.5}
                          max={5}
                          min={1}
                        /> */}
                      </FormControl>
                      <FormMessage />
                      <p>{field.value}</p>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex gap-2 items-center ">
                      <FormLabel className="mt-2">Is Feature</FormLabel>
                      <FormControl>
                        <Switch
                          id="airplane-mode"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Form field variants which takes input and adds variant form */}
                {/* <VariantForm form={form} /> */}
                <FormField
                  control={form.control}
                  name="colors"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Colors</FormLabel>
                        <FormDescription>
                          Select the colors you want to add to your product.
                        </FormDescription>
                      </div>
                      {colors_options.map((color) => (
                        <FormField
                          key={color.id}
                          control={form.control}
                          name="colors"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={color.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(color.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            color.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== color.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {color.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Label</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="eg: 🎉BestSeller, New Arrival"
                          {...field}
                          className="placeholder:opacity-50 focus:placeholder:opacity-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select the category of the product" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CATEGORIES.map((category, i) => (
                            <SelectItem key={i} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the category of the product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full"
                >
                  {actionType === "add" ? "Add Product" : "Edit Product"}
                  {isSubmitting && (
                    <RotateCw className="animate-spin mr-2" size={15} />
                  )}
                </Button>
              </form>
            </Form>{" "}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
