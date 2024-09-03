import React from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Ellipsis, Menu } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
const AdminMenuBar = () => {
  return (
    <div className='md:hidden'>
      <Popover>
        <PopoverTrigger><Menu/></PopoverTrigger>
        <PopoverContent className="w-36 space-y-2">
          <Link href={"/admin/orders"}  className='w-full'>
            <Button variant={"outline"} className='w-full'>
              Orders
            </Button>
          </Link>
          <Link href={"/admin/products"}  className='w-full'>
            <Button variant={"outline"}  className='w-full'>
              Products
            </Button>
          </Link>

        </PopoverContent>
      </Popover></div>
  )
}

export default AdminMenuBar