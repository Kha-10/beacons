"use client";

import * as React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  PlusCircle,
  ChevronsUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { socialAccounts } from "@/lib/data";
import type { SocialAccount } from "@/lib/types";

const platformIcons: Record<SocialAccount["id"], React.ReactNode> = {
  facebook: <Facebook className="h-5 w-5 text-blue-600" />,
  instagram: <Instagram className="h-5 w-5 text-pink-500" />,
  twitter: <Twitter className="h-5 w-5 text-sky-500" />,
};

const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!;
const REDIRECT_URI = process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI!;
const SCOPES = [
  "pages_manage_posts",
  "pages_read_engagement",
  "business_management",
  "public_profile",
].join(",");

export default function AccountSwitcher() {
  const [selectedAccount, setSelectedAccount] = React.useState<SocialAccount>(
    socialAccounts[0]
  );

  const handleLogin = () => {
    const oauthUrl = `https://www.facebook.com/v24.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${SCOPES}&response_type=code&auth_type=rerequest`;
    window.location.href = oauthUrl;
  };

  return (
    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    //     <Button
    //       variant="outline"
    //       className="w-full justify-between md:w-[280px]"
    //     >
    //       <div className="flex items-center gap-3">
    //         {platformIcons[selectedAccount.id]}
    //         <span className="font-medium">{selectedAccount.name}</span>
    //         <span className="text-muted-foreground hidden sm:inline">
    //           {selectedAccount.handle}
    //         </span>
    //       </div>
    //       <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
    //     </Button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent className="w-full md:w-[280px]" align="end">
    //     {socialAccounts.map((account) => (
    //       <DropdownMenuItem
    //         key={account.id}
    //         onSelect={() => setSelectedAccount(account)}
    //       >
    //         <div className="flex items-center gap-3">
    //           {platformIcons[account.id]}
    //           <span className="font-medium">{account.name}</span>
    //           <span className="text-muted-foreground">{account.handle}</span>
    //         </div>
    //       </DropdownMenuItem>
    //     ))}
    //     <DropdownMenuSeparator />
    //     <DropdownMenuItem>
    //       <PlusCircle className="mr-2 h-5 w-5" />
    //       Connect new account
    //     </DropdownMenuItem>
    //   </DropdownMenuContent>
    // </DropdownMenu>
    // <div
    //   className="fb-login-button"
    //   data-width="48"
    //   data-size=""
    //   data-button-type=""
    //   data-layout=""
    //   data-auto-logout-link="false"
    //   data-use-continue-as="false"
    // ></div>
    <button
      onClick={handleLogin}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Connect with Facebook
    </button>
  );
}
