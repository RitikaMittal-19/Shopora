//add a new product

import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/middlewares/authSeller";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import imagekit from "@/lib/imagekit";

export async function POST(request)
 {
     try {
        const { userId } = getAuth(request);
        const storeId = await authSeller(userId);

        if (!storeId) {
            return NextResponse.json({ error: "Unauthorized or store not approved" }, { status: 401 });
        }

       const formData = await request.formData();

       const name = formData.get("name");
       const description = formData.get("description");
       const price = Number(formData.get("price"));
       const mrp = Number(formData.get("mrp"));
       const category = formData.get("category");
       const images = formData.getAll("images");

       if (!name || !description || !price || !mrp || !category ||  images.length < 1) {
           return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
       }

      const imagesUrl =await Promise.all(images.map(async(image)=>{
            const buffer = Buffer.from(await image.arrayBuffer());
            const response=await imagekit.upload({
                file:buffer,
                fileName:image.name,
                folder:"products"
            })
            const url=  imagekit.url({
                path: response.filePath,
                transformation: [
                    {
                        quality:'auto',
                        format:'webp',
                        width: "1024"
                    }
                ]
            })
            return url;
        }))

        await prisma.product.create({
            data:{
                name,
                description,
                price,
                mrp,
                category,
                images:imagesUrl,
                storeId
            }
        })

        return NextResponse.json({ message: "Product added successfully" });
            
     }
     catch(error){
        console.error("Error creating store:", error);
        return NextResponse.json({error: error.code || error.message}, { status: 400 });
     }
}
   


//get all product for seller

export async function GET(request)
{
    try {
        const { userId } = getAuth(request);
        const storeId = await authSeller(userId);

        if (!storeId) {
            return NextResponse.json({ error: "Unauthorized or store not approved" }, { status: 401 });
        }

        const products = await prisma.product.findMany({where: { storeId}});
           
            return NextResponse.json({ products });

            
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
       