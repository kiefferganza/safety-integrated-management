<?php

namespace App\Models\Operation\Store;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Store extends Model implements HasMedia
{
	use HasFactory, InteractsWithMedia;

	protected static function boot()
	{
		parent::boot();

		// Generate slug when creating a new Store
		static::creating(function (Store $store)
		{
			$store->slug = Str::slug($store->name);
		});

		// Update slug when the name is updated
		static::saving(function (Store $store)
		{
			if ($store->isDirty('name'))
			{
				$store->slug = Str::slug($store->name);
			}
		});
	}

	public function storeImages($images)
	{
		if ($images)
		{
			foreach ($images as $image)
			{
				$this->addMedia($image)->toMediaCollection('images')->save();
			}
		}
	}

	public function registerMediaConversions(Media $media = null): void
	{
		$this->addMediaConversion('thumbnail', function (Media $media)
		{
			return $media->width() > 100 ? $media->resize(100, 100) : $media;
		})->optimize();

		$this->addMediaConversion('small')
			->width(500)
			->height(500)
			->optimize();

		$this->addMediaConversion('medium')
			->width(800)
			->height(800)
			->optimize();

		$this->addMediaConversion('large')
			->width(1920)
			->height(1080)
			->optimize();
	}


	public function history()
	{
		return $this->hasMany(StoreHistory::class);
	}

	protected $guarded = [];
}
