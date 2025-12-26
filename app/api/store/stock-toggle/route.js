//toggle stock status of a product

import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";

export async function POST  (request)
{
     try{
        const { userId } = getAuth(request);
         const { productId } = await request.json();

        if(!productId){
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }


        const storeId = await authSeller(userId);

        if (!storeId) {
            return NextResponse.json({ error: "Unauthorized or store not approved" }, { status: 401 });
        }

       
        const product = await prisma.product.findFirst({
            where: { id: productId, storeId }
        });

        if(!product){
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        await prisma.product.update({
            where: { id: productId },
            data: { inStock: !product.inStock }
        });

        return NextResponse.json({ message: "Product stock status updated" });

     }catch(error){
       console.error("Error  stock toggling:", error);
       return NextResponse.json({error: error.code || error.message}, { status: 400 });
     
     }
}