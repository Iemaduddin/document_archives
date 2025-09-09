<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        Role::create(['name' => 'Super Admin']);
        Role::create(['name' => 'Admin']);

        $super_admin = User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@example.com'
        ]);
        $admin =  User::factory()->create([
            'name' => 'Administrator',
            'email' => 'admin@example.com',
        ]);

        $super_admin->assignRole('Super Admin');
        $admin->assignRole('Admin');

        $this->call(CategorySeeder::class);
    }
}
