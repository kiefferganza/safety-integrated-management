<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Inventory extends Model
{
	use HasFactory;

	protected $table = 'tbl_inventory';

	protected $primaryKey = 'inventory_id';

	// const CREATED_AT = 'date_created';
	// const UPDATED_AT = 'date_updated';
	public $timestamps = false;

	protected $guarded = [];

	protected static function boot() {
		parent::boot();

		static::creating(function ($inventory) {
			$inventory->slug = Str::slug($inventory->item);
		});
	}


	public function bound() {
		return $this->hasMany(InventoryBound::class, "inventory_id");
	}


	public function user() {
		return $this->belongsTo(User::class, "user_id");
	}


}
