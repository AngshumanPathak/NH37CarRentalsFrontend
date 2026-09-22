import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { useEffect } from 'react';

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { formSchema } from '../Validation';
import { FileUploaderMarket } from './FileUploader';
import { addVehicle } from '@//lib/apis/apis';




const defaultValues = {
    name: '',
    fuelType: '',
    category: '',
    seatCapacity: '',
    image: [],
    price: 0,
    bookedFrom: new Date(),
    bookedTill: new Date(),
    availability: true,
};



export function AddForm() {

    

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        
    
        try {
            const vehicleData = {
                ...data,
                image: data.image ? (Array.isArray(data.image) ? data.image : [data.image]) : [], // ✅ Handles both single & multiple images
            };
    
            const response = await addVehicle(vehicleData);
    
            console.log("Upload success:", response);
        } catch (error) {
            console.error("Upload failed:", error);
        }    
        
    };
    
    

  

    useEffect(() => {
        console.log(form.formState.errors);
    }, [form.formState.errors]);
    
   
    return (
        
        
        
        <div className='text-white p-10'>

        <div className="text-2xl font-bold mb-10">
           
        </div>
             
           <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Vehicle Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter vehicle name" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is the name of the vehicle.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

               <FormField
                 control={form.control}
                  name="image"
                  render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">Upload Image</FormLabel>
                    <FormControl>
                     <FileUploaderMarket  
                       fieldChange={field.onChange}
                       docUrl={[]}                     
                    />
                  </FormControl>
                   <FormMessage />
                </FormItem>
                 )}
              />

                
                <FormField
                    control={form.control}
                    name="bookedFrom"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Booked From</FormLabel>
                            <FormControl>
                                <Input type="date"
                                 value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                                 onChange={(e) => field.onChange(new Date(e.target.value))} />
                            </FormControl>

                            
                            <FormDescription>
                                Booking From
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bookedTill"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Booked Till</FormLabel>
                            <FormControl>
                                <Input type="date"
                                 value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                                 onChange={(e) => field.onChange(new Date(e.target.value))} />
                            </FormControl>

                            
                            <FormDescription>
                                Booked Till
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price/ Day</FormLabel>
                            <FormControl>
                                <Input type='number' placeholder="Price/ Day" {...field}
                                onChange={(e) => field.onChange(Number(e.target.value) || '')} />
                            </FormControl>
                            <FormDescription>
                                Price per day
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="fuelType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Fuel Type</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Fuel Type" {...field} />
                            </FormControl>
                            <FormDescription>
                                Fuel Type
                            </FormDescription>
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
                            <FormControl>
                                <Input placeholder="Enter Category (SUV/ Hatchback/ Sedan)" {...field} />
                            </FormControl>
                            <FormDescription>
                                Category
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="seatCapacity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Seat Capacity</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Seat Capacity" {...field} />
                            </FormControl>
                            <FormDescription>
                                Enter seating capacity
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                


                <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Availability</FormLabel>
                            <FormControl>
                                <select value={field.value ? 'Available' : 'Unavailable'} onChange={(e) => field.onChange(e.target.value)} className="border p-2 rounded-md w-full">
                                    <option value="Available">Available</option>
                                    <option value="Unavailable">Unavailable</option>
                                </select>
                            </FormControl>
                            <FormDescription>
                                Check if the vehicle is available.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <Button className='justify-start text-left font-bold rounded-md bg-yellow-500 text-white 'type="submit">Submit</Button>
            </form>
          </Form>

        </div>
        
    );
}