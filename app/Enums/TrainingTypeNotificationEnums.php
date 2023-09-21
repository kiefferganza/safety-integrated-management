<?php
namespace App\Enums;

enum TrainingTypeNotificationEnums: string {
	case APPROVER = 'approver';
	case REVIEWER = 'reviewer';
	case PARTICIPANT = 'participant';
}