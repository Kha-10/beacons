'use client';

import * as React from 'react';
import {
  Facebook,
  Instagram,
  Twitter,
  PlusCircle,
  ChevronsUpDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { socialAccounts } from '@/lib/data';
import type { SocialAccount } from '@/lib/types';

const platformIcons: Record<SocialAccount['id'], React.ReactNode> = {
  facebook: <Facebook className="h-5 w-5 text-blue-600" />,
  instagram: <Instagram className="h-5 w-5 text-pink-500" />,
  twitter: <Twitter className="h-5 w-5 text-sky-500" />,
};

export default function AccountSwitcher() {
  const [selectedAccount, setSelectedAccount] = React.useState<SocialAccount>(
    socialAccounts[0]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between md:w-[280px]"
        >
          <div className="flex items-center gap-3">
            {platformIcons[selectedAccount.id]}
            <span className="font-medium">{selectedAccount.name}</span>
            <span className="text-muted-foreground hidden sm:inline">
              {selectedAccount.handle}
            </span>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full md:w-[280px]" align="end">
        {socialAccounts.map((account) => (
          <DropdownMenuItem
            key={account.id}
            onSelect={() => setSelectedAccount(account)}
          >
            <div className="flex items-center gap-3">
              {platformIcons[account.id]}
              <span className="font-medium">{account.name}</span>
              <span className="text-muted-foreground">{account.handle}</span>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <PlusCircle className="mr-2 h-5 w-5" />
          Connect new account
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
