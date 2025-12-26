//get store info& store products

import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";

export async function GET  (request){
    try{

        //get store username from query

        const { searchParams } = new URL(request.url);
        const username = searchParams.get('username').toLowerCase();

        if(!username){
            return NextResponse.json({ error: "Username is required" }, { status: 400 });
        }

        const store = await prisma.store.findUnique({
            where:{ username,isActive:true },
            include:{Prouct:{include:{rating:true}}}
        });

        if(!store){
            return NextResponse.json({ error: "Store not found" }, { status: 400 });
        }
        return NextResponse.json({ store });


    }
    
    catch(error){
       console.error("Error fetching store info:", error);
       return NextResponse.json({error: error.code || error.message}, { status: 400 });
     
     }
}
