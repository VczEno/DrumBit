<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PatternSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Pattern::factory()->create([
            'pattern' => '34952|2056|43690|0|0|0|0|0|0|',
             'user_id' => '1'
        ]);

        \App\Models\Pattern::factory()->create([
            'pattern' => '35108|8200|9766|1|64|0|0|0|0|',
             'user_id' => '1'
        ]);
    }
}
