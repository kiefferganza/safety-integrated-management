<?php

namespace Database\Seeders;

use App\Models\IncidentType;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class IncidentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
			$incident_types = [
				["name" => "NM", "type" => "indicator"],
				["name" => "FAC", "type" => "indicator"],
				["name" => "STA", "type" => "indicator"],
				["name" => "WSA", "type" => "indicator"],
				["name" => "HELP", "type" => "indicator"],
				["name" => "ORIENTATION", "type" => "indicator"],
				["name" => "TRAINING", "type" => "indicator"],
				["name" => "SUP. TRG", "type" => "indicator"],
				["name" => "TBT", "type" => "indicator"],

				["name" => "Crane", "type" => "equipment"],
				["name" => "Forklift", "type" => "equipment"],
				["name" => "Scaffolding", "type" => "equipment"],
				["name" => "Power Tools", "type" => "equipment"],
				["name" => "Welding/Compressors", "type" => "equipment"],
				["name" => "Bus", "type" => "equipment"],
				["name" => "Coaster", "type" => "equipment"],
				["name" => "Suv", "type" => "equipment"],

				["name" => "FAT", "type" => "incident"],
				["name" => "LTC", "type" => "incident"],
				["name" => "RWC", "type" => "incident"],
				["name" => "MTC", "type" => "incident"],
				["name" => "FAC", "type" => "incident"],
				["name" => "NM", "type" => "incident"],
				["name" => "PD", "type" => "incident"],
				["name" => "TRAF", "type" => "incident"],
				["name" => "FIRE", "type" => "incident"],
				["name" => "ENV", "type" => "incident"],
				
				["name" => "Struck By Moving Object", "type" => "mechanism"],
				["name" => "Struck Against", "type" => "mechanism"],
				["name" => "Fall to lower level", "type" => "mechanism"],
				["name" => "Fall to same level", "type" => "mechanism"],
				["name" => "Caught In", "type" => "mechanism"],
				["name" => "Caught On", "type" => "mechanism"],
				["name" => "Caught Between Or Under", "type" => "mechanism"],
				["name" => "Movement, Posture / Manual", "type" => "mechanism"],
				["name" => "Contact With (particulate, electricity, heat, cold, radiation,  noise, chemical", "type" => "mechanism"],
				["name" => "Overstress, Overexertion, Overload", "type" => "mechanism"],
				["name" => "Slip / Trip / Fall at the same level", "type" => "mechanism"],
				["name" => "Other", "type" => "mechanism"],
				
				["name" => "Abrasion", "type" => "nature"],
				["name" => "Amputation", "type" => "nature"],
				["name" => "Asphyxia", "type" => "nature"],
				["name" => "Bites/Stings", "type" => "nature"],
				["name" => "Bruise/Contusion", "type" => "nature"],
				["name" => "Burn/Chemical", "type" => "nature"],
				["name" => "Burn/Thermal", "type" => "nature"],
				["name" => "Cold Related", "type" => "nature"],
				["name" => "Concussion", "type" => "nature"],
				["name" => "Cut/Laceration", "type" => "nature"],
				["name" => "Electrical Shock", "type" => "nature"],
				["name" => "Fracture", "type" => "nature"],
				["name" => "Hearing Loss", "type" => "nature"],
				["name" => "Heat Related", "type" => "nature"],
				["name" => "Poisoning", "type" => "nature"],
				["name" => "Skin Disorder", "type" => "nature"],
				["name" => "Other", "type" => "nature"],
				
				["name" => "Not Following Procedures", "type" => "root_cause"],
				["name" => "Intentional/Lack of Awareness/Behaviors", "type" => "root_cause"],
				["name" => "Use of Tools Equipment,Materials and Products", "type" => "root_cause"],
				["name" => "Protective Systems", "type" => "root_cause"],
				["name" => "Integrity of Tools/PLan/Equipment, Material", "type" => "root_cause"],
				["name" => "Workplace Hazards", "type" => "root_cause"],
				["name" => "Organizational", "type" => "root_cause"],
				["name" => "Other", "type" => "root_cause"],
				
				["name" => "Minor", "description" => "low", "type" => "severity"],
				["name" => "Significant", "description" => "medium", "type" => "severity"],
				["name" => "Major", "description" => "high", "type" => "severity"],
				["name" => "Fatality", "description" => "extreme", "type" => "severity"],
				
				["name" => "Head", "type" => "body_part"],
				["name" => "Face", "type" => "body_part"],
				["name" => "Eyebrow", "type" => "body_part"],
				["name" => "Nose", "type" => "body_part"],
				["name" => "Lip", "type" => "body_part"],
				["name" => "Eye", "type" => "body_part"],
				["name" => "Mouth", "type" => "body_part"],
				["name" => "Cheek", "type" => "body_part"],
				["name" => "Forehead", "type" => "body_part"],
				["name" => "Arms", "type" => "body_part"],
				["name" => "Shoulders", "type" => "body_part"],
				["name" => "Hand", "type" => "body_part"],
				["name" => "Elbows", "type" => "body_part"],
				["name" => "Fingers", "type" => "body_part"],
				["name" => "Back", "type" => "body_part"],
				["name" => "Knee", "type" => "body_part"],
				["name" => "Legs", "type" => "body_part"],
				["name" => "Neck", "type" => "body_part"],
			];
			
			foreach ($incident_types as $incident) {
				IncidentType::create($incident);
			}

			$incident_permissions = [
				'incident_create',
				'incident_edit',
				'incident_show',
				'incident_delete',
				'incident_access',
			];

			foreach ($incident_permissions as $per) {
				Permission::create([
					"name" => $per
				]);
			}

			User::where('user_type', 1)->where('deleted', 0)->get()->map(function($user){
				$user->givePermissionTo([
					"incident_create",
					"incident_edit",
					"incident_show",
					"incident_delete"
				]);
			});
    }
}
