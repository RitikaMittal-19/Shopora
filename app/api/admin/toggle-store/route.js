import {getAuth} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authAdmin from "@/middlewares/authAdmin";
import prisma from "@/lib/prisma";


//TOGGLE STORE isActive

export async function POST(request) {
    try{
        const {userId}= getAuth(request);   
        const isAdmin= await authAdmin(userId);

        if(!isAdmin){
            return NextResponse.json("Unauthorized", {status: 401});
        }

       const {storeId}=await request.json();

       if(!storeId){
        return NextResponse.json({error:"Missing StoreId"}, {status:400});
       }
       

       //find store 


       const store= await prisma.store.findUnique({
        where:{id:storeId}
       });

       if(!store){
        return NextResponse.json({error:"Store not found"}, {status:400});
       }
        await prisma.store.update({
        where:{id:storeId},
        data:{isActive: !store.isActive}
       });

       return NextResponse.json({message:"Store updated successfully"});

        
    }catch(error){
        console.log("Error in approve-store GET route:", error);
        return NextResponse.json({error: error.code || error.message}, {status: 400});
    }
}