<?php

class Room extends \Eloquent {
	protected $fillable = [];

	public function messages() {
		return $this->hasMany('Message');
	}
}
