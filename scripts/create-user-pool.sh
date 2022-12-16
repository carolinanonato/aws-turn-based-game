# Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: MIT-0
USER_POOL_ID=$(aws cognito-idp create-user-pool \
  --pool-name turn-based-users \
  --policies '
      {
        "PasswordPolicy": {
          "MinimumLength": 8,
          "RequireUppercase": true,
          "RequireLowercase": true,
          "RequireNumbers": true,
          "RequireSymbols": false
        }
      }' \
  --schema '[
      {
        "Name": "phone_number",
        "StringAttributeConstraints": {
            "MinLength": "0",
            "MaxLength": "2048"
        },
        "DeveloperOnlyAttribute": false,
        "Required": true,
        "AttributeDataType": "String",
        "Mutable": true
      }
  ]' \
  --query 'UserPool.Id' \
  --output text)

echo "User Pool created with id ${USER_POOL_ID}"
echo "export USER_POOL_ID=${USER_POOL_ID}" >> env.sh
