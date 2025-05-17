import { LogOut, User, Workflow } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import { getCurrentUser, signOut } from "@/lib/actions/auth.action";

const Navbar = async () => {
  const user = await getCurrentUser();

  return (
    <nav className="flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.svg" alt="logo" width={38} height={32} />
        <h2 className="text-primary-100">TechInterviews</h2>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer">
            <h6 className="max-sm:hidden">{user?.name}</h6>
            {!user?.photoURL ? (
              <Image
                src="/user.png"
                alt="user avatar"
                width={40}
                height={40}
                className="rounded-full object-cover cursor-pointer"
              />
            ) : (
              <Image
                src={user.photoURL}
                alt="user avatar"
                width={40}
                height={40}
                className="rounded-full object-cover cursor-pointer"
              />
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Profile</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem disabled>
              <User />
              <span>{user?.name}</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Workflow />
              <span>Role</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut />
            <span onClick={signOut}>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

export default Navbar;
